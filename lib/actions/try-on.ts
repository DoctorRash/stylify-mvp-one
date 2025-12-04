'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function generateTryOn(formData: FormData) {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return { error: 'Not authenticated' };
    }

    const userImage = formData.get('userImage') as File;
    const garmentImage = formData.get('garmentImage') as File;

    if (!userImage || !garmentImage) {
        return { error: 'Both user and garment images are required' };
    }

    try {
        // 1. Upload user image to Supabase Storage
        const userFileExt = userImage.name.split('.').pop();
        const userFileName = `${session.user.id}/user_${Math.random().toString(36).substring(2)}.${userFileExt}`;

        const { error: userUploadError } = await supabase.storage
            .from('try-on-images')
            .upload(userFileName, userImage);

        if (userUploadError) {
            console.error('User image upload error:', userUploadError);
            return { error: 'Failed to upload user image' };
        }

        const { data: { publicUrl: userPublicUrl } } = supabase.storage
            .from('try-on-images')
            .getPublicUrl(userFileName);

        // 2. Upload garment image to Supabase Storage
        const garmentFileExt = garmentImage.name.split('.').pop();
        const garmentFileName = `${session.user.id}/garment_${Math.random().toString(36).substring(2)}.${garmentFileExt}`;

        const { error: garmentUploadError } = await supabase.storage
            .from('try-on-images')
            .upload(garmentFileName, garmentImage);

        if (garmentUploadError) {
            console.error('Garment image upload error:', garmentUploadError);
            return { error: 'Failed to upload garment image' };
        }

        const { data: { publicUrl: garmentPublicUrl } } = supabase.storage
            .from('try-on-images')
            .getPublicUrl(garmentFileName);

        // 3. Call Replicate API with IDM-VTON model
        const REPLICATE_API_TOKEN = process.env.AI_API_KEY;

        if (!REPLICATE_API_TOKEN) {
            return { error: 'AI service not configured' };
        }

        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Using IDM-VTON model - popular virtual try-on model
                version: "c871bb9b046607b680ea2b8e19f5f71b4ec2c99b5f9c64e2b36e2c3b8c1e6f62",
                input: {
                    human_img: userPublicUrl,
                    garm_img: garmentPublicUrl,
                    // Optional parameters for better results
                    garment_des: "clothing", // Can be customized based on garment type
                }
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Replicate error:', error);
            return { error: 'AI generation failed. Please check your API key and try again.' };
        }

        const prediction = await response.json();

        return { predictionId: prediction.id, status: prediction.status };

    } catch (err) {
        console.error('AI Try-On error:', err);
        return { error: 'Failed to generate try-on' };
    }
}

export async function getTryOnResult(predictionId: string) {
    const REPLICATE_API_TOKEN = process.env.AI_API_KEY;

    if (!REPLICATE_API_TOKEN) {
        return { error: 'AI service not configured' };
    }

    try {
        const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
            headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return { error: 'Failed to fetch prediction status' };
        }

        const prediction = await response.json();
        return {
            status: prediction.status,
            output: prediction.output // Replicate returns output as array of image URLs usually
        };

    } catch (err) {
        console.error('Error fetching try-on result:', err);
        return { error: 'Failed to check status' };
    }
}
