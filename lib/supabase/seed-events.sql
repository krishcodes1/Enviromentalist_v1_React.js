-- Seed script for events
INSERT INTO events (
  id,
  title,
  description,
  location,
  is_virtual,
  start_time,
  end_time,
  max_attendees,
  category,
  tags,
  image_url,
  creator_id,
  attendee_count
)
VALUES
  (
    '9cd7d876-1972-4b1a-93c5-534d6d1a717b',
    'Beach Cleanup Day',
    'Join us for a day of cleaning up the local beach. Bring gloves and water!',
    'Sunset Beach, Main Entrance',
    false,
    (CURRENT_DATE + INTERVAL '7 days')::timestamp + '10:00:00'::time,
    (CURRENT_DATE + INTERVAL '7 days')::timestamp + '14:00:00'::time,
    50,
    'Cleanup',
    ARRAY['beach', 'ocean', 'plastic', 'volunteer'],
    'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=1000',
    '5f8cfd66-89a8-4d22-a2a3-b79d460fd300',
    0
  ),
  (
    'a7c53eb1-79c2-4a0a-8f5e-21d67bc6eb94',
    'Tree Planting Initiative',
    'Help us restore the local forest by planting native trees. Tools and saplings provided!',
    'Green Valley Park',
    false,
    (CURRENT_DATE + INTERVAL '14 days')::timestamp + '09:00:00'::time,
    (CURRENT_DATE + INTERVAL '14 days')::timestamp + '15:00:00'::time,
    30,
    'Conservation',
    ARRAY['trees', 'forest', 'planting', 'nature'],
    'https://images.unsplash.com/photo-1513028894927-8ea2341d8b68?auto=format&fit=crop&q=80&w=1000',
    '5f8cfd66-89a8-4d22-a2a3-b79d460fd300',
    0
  ),
  (
    'b9e8d5f2-3a7c-4e1d-9f6b-8c2e4a5d6b7c',
    'Sustainable Living Workshop',
    'Learn practical tips for reducing your environmental footprint at home.',
    'Community Center, Room 203',
    false,
    (CURRENT_DATE + INTERVAL '21 days')::timestamp + '18:00:00'::time,
    (CURRENT_DATE + INTERVAL '21 days')::timestamp + '20:00:00'::time,
    25,
    'Education',
    ARRAY['sustainability', 'workshop', 'eco-friendly', 'lifestyle'],
    'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&q=80&w=1000',
    '5f8cfd66-89a8-4d22-a2a3-b79d460fd300',
    0
  ),
  (
    'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    'Virtual Climate Action Meeting',
    'Join our online discussion about local climate initiatives and how you can get involved.',
    NULL,
    true,
    (CURRENT_DATE + INTERVAL '5 days')::timestamp + '19:00:00'::time,
    (CURRENT_DATE + INTERVAL '5 days')::timestamp + '20:30:00'::time,
    100,
    'Advocacy',
    ARRAY['climate', 'action', 'virtual', 'community'],
    'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1000',
    '5f8cfd66-89a8-4d22-a2a3-b79d460fd300',
    0
  ),
  (
    'd4e5f6g7-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    'Farmers Market Volunteer Day',
    'Help support local sustainable farmers by volunteering at the weekly farmers market.',
    'Downtown Square',
    false,
    (CURRENT_DATE + INTERVAL '3 days')::timestamp + '08:00:00'::time,
    (CURRENT_DATE + INTERVAL '3 days')::timestamp + '13:00:00'::time,
    15,
    'Volunteer',
    ARRAY['food', 'local', 'sustainable', 'community'],
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=1000',
    '5f8cfd66-89a8-4d22-a2a3-b79d460fd300',
    0
  );

-- Create an API endpoint to run this seed script
