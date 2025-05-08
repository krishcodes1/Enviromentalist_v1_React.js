-- Seed Communities Data
DO $$
DECLARE
    user_ids UUID[] := ARRAY(SELECT id FROM auth.users LIMIT 10);
    user_id UUID;
    community_id UUID;
    post_id UUID;
    comment_id UUID;
    i INT;
    j INT;
    k INT;
    community_categories TEXT[] := ARRAY['Environment', 'Climate Action', 'Sustainability', 'Conservation', 'Renewable Energy', 'Zero Waste', 'Eco-Friendly Living', 'Wildlife Protection', 'Ocean Conservation', 'Urban Gardening'];
    community_names TEXT[] := ARRAY['Green Earth Alliance', 'Climate Guardians', 'Sustainable Future Collective', 'Nature Defenders', 'Clean Energy Advocates', 'Zero Waste Warriors', 'Eco Living Network', 'Wildlife Protectors', 'Ocean Cleanup Crew', 'Urban Garden Community'];
    community_descriptions TEXT[] := ARRAY[
        'A community dedicated to protecting our planet through collective action and awareness.',
        'Join us in the fight against climate change through education, advocacy, and direct action.',
        'Building a sustainable future through innovative practices and community engagement.',
        'Protecting natural habitats and biodiversity through conservation efforts and education.',
        'Advocating for clean, renewable energy solutions to combat climate change.',
        'Working towards a zero waste lifestyle and promoting circular economy principles.',
        'Sharing tips and resources for eco-friendly living and sustainable consumption.',
        'Dedicated to the protection and conservation of wildlife and their habitats.',
        'Focused on cleaning and protecting our oceans from pollution and exploitation.',
        'Creating green spaces in urban environments through community gardening initiatives.'
    ];
    post_titles TEXT[] := ARRAY[
        'Join our weekend cleanup event!',
        'New study on climate impact released',
        'Tips for reducing your carbon footprint',
        'Local conservation success story',
        'Solar panel installation workshop',
        'Zero waste shopping guide',
        'DIY eco-friendly cleaning products',
        'Wildlife photography contest',
        'Beach cleanup results - we collected 500 lbs of trash!',
        'Community garden harvest celebration'
    ];
    post_contents TEXT[] := ARRAY[
        'We''re organizing a cleanup event this weekend at the local park. Bring gloves and join us!',
        'A new study shows that our collective efforts are making a difference. Check out the details!',
        'Here are 10 simple ways you can reduce your carbon footprint today.',
        'Our local conservation project has successfully protected the endangered species in our area.',
        'Learn how to install solar panels at our upcoming workshop. Registration is now open!',
        'Check out our comprehensive guide to zero waste shopping in the local area.',
        'Save money and reduce waste with these simple DIY eco-friendly cleaning product recipes.',
        'Show off your wildlife photography skills and win prizes in our upcoming contest.',
        'Thanks to all volunteers who participated in our beach cleanup. We collected 500 lbs of trash!',
        'Join us for our community garden harvest celebration. Bring a dish to share!'
    ];
    comment_contents TEXT[] := ARRAY[
        'Great initiative! I''ll be there.',
        'Thanks for sharing this important information.',
        'I''ve been using these tips and they really work!',
        'So proud of our community for this achievement.',
        'I attended last year''s workshop and it was very informative.',
        'This guide is so helpful! I''ve already started implementing these practices.',
        'I made the all-purpose cleaner and it works great!',
        'Looking forward to participating in the contest.',
        'Proud to have been part of this cleanup effort.',
        'Can''t wait for the celebration! I''ll bring my famous vegan dish.'
    ];
BEGIN
    -- Only proceed if we have users
    IF array_length(user_ids, 1) > 0 THEN
        -- Create communities
        FOR i IN 1..10 LOOP
            -- Select a random user as creator
            user_id := user_ids[1 + (i % array_length(user_ids, 1))];
            
            -- Insert community
            INSERT INTO communities (
                name, 
                description, 
                creator_id, 
                category, 
                image_url, 
                is_private, 
                member_count
            ) VALUES (
                community_names[i],
                community_descriptions[i],
                user_id,
                community_categories[i],
                '/placeholder.svg?height=200&width=200&query=' || community_names[i],
                FALSE,
                (random() * 50 + 5)::INT
            ) RETURNING id INTO community_id;
            
            -- Add creator as admin member
            INSERT INTO community_members (
                community_id,
                user_id,
                role
            ) VALUES (
                community_id,
                user_id,
                'admin'
            );
            
            -- Add some random members
            FOR j IN 1..5 LOOP
                -- Skip if it's the creator
                IF user_ids[1 + (j % array_length(user_ids, 1))] <> user_id THEN
                    INSERT INTO community_members (
                        community_id,
                        user_id,
                        role
                    ) VALUES (
                        community_id,
                        user_ids[1 + (j % array_length(user_ids, 1))],
                        'member'
                    ) ON CONFLICT (community_id, user_id) DO NOTHING;
                END IF;
            END LOOP;
            
            -- Create posts for this community
            FOR j IN 1..3 LOOP
                -- Select a random user as post creator
                user_id := user_ids[1 + ((i+j) % array_length(user_ids, 1))];
                
                -- Insert post
                INSERT INTO posts (
                    user_id,
                    title,
                    content,
                    community_id,
                    tags
                ) VALUES (
                    user_id,
                    post_titles[1 + ((i+j) % array_length(post_titles, 1))],
                    post_contents[1 + ((i+j) % array_length(post_contents, 1))],
                    community_id,
                    ARRAY['environment', 'community']
                ) RETURNING id INTO post_id;
                
                -- Add comments to the post
                FOR k IN 1..2 LOOP
                    -- Select a random user as commenter
                    user_id := user_ids[1 + ((i+j+k) % array_length(user_ids, 1))];
                    
                    -- Insert comment
                    INSERT INTO post_comments (
                        post_id,
                        user_id,
                        content
                    ) VALUES (
                        post_id,
                        user_id,
                        comment_contents[1 + ((i+j+k) % array_length(comment_contents, 1))]
                    );
                END LOOP;
            END LOOP;
        END LOOP;
    END IF;
END $$;
