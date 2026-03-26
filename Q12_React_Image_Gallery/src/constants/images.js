const images = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
    alt: 'Forest mountain landscape'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=80',
    alt: 'River flowing through canyon'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80',
    alt: 'Road in green valley'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    alt: 'Snow covered mountain peak'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    alt: 'Waterfall in lush jungle'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    alt: 'Sunset over calm lake'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80',
    alt: 'Ocean wave close-up'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    alt: 'Desert dunes at sunset'
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=900&q=80',
    alt: 'Cabin near mountain lake'
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80',
    alt: 'Misty forest trail'
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80',
    alt: 'Aerial view of beach coast'
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=900&q=80',
    alt: 'Night sky and milky way'
  },
  {
    id: 13,
    src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=900&q=80',
    alt: 'Mountain reflection in lake'
  },
  {
    id: 14,
    src: 'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?auto=format&fit=crop&w=900&q=80',
    alt: 'Winding road in hills'
  },
  {
    id: 15,
    src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80',
    alt: 'Bridge over turquoise water'
  },
  {
    id: 16,
    src: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=900&q=80',
    alt: 'Pine trees and fog'
  },
  {
    id: 17,
    src: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?auto=format&fit=crop&w=900&q=80',
    alt: 'Sunny meadow in mountains'
  },
  {
    id: 18,
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    alt: 'Tropical beach waves'
  },
  {
    id: 19,
    src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80',
    alt: 'Wildlife in natural habitat'
  },
  {
    id: 20,
    src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80',
    alt: 'Sunlight through dense forest'
  },
  {
    id: 21,
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    alt: 'Highland mountain ridge'
  },
  {
    id: 22,
    src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=900&q=80',
    alt: 'Blue alpine lake'
  },
  {
    id: 23,
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
    alt: 'Clouds over forest valley'
  },
  {
    id: 24,
    src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
    alt: 'Sea horizon at golden hour'
  },
  {
    id: 25,
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    alt: 'Remote island shoreline'
  },
  {
    id: 26,
    src: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&w=900&q=80',
    alt: 'Cloudy mountain summit'
  },
  {
    id: 27,
    src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=900&q=80',
    alt: 'Forest canopy in daylight'
  },
  {
    id: 28,
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80',
    alt: 'Open road through desert'
  },
  {
    id: 29,
    src: 'https://images.unsplash.com/photo-1455218873509-8097305ee378?auto=format&fit=crop&w=900&q=80',
    alt: 'Rocky coast from above'
  },
  {
    id: 30,
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    alt: 'Path between tall trees'
  },
  {
    id: 31,
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    alt: 'Waterfall through canyon rocks'
  },
  {
    id: 32,
    src: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80',
    alt: 'Coastal cliffs and open sea'
  },
  {
    id: 33,
    src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80',
    alt: 'Deer in a green meadow'
  },
  {
    id: 34,
    src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
    alt: 'Sunset wave and golden sky'
  },
  {
    id: 35,
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
    alt: 'Cloud inversion over mountains'
  },
  {
    id: 36,
    src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=900&q=80',
    alt: 'Dense forest and tall pines'
  },
  {
    id: 37,
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80',
    alt: 'Scenic highway through arid land'
  },
  {
    id: 38,
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    alt: 'Wind patterns across sand dunes'
  },
  {
    id: 39,
    src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
    alt: 'Snowy peaks above dark forest'
  },
  {
    id: 40,
    src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=80',
    alt: 'Rocky valley with winding river'
  },
  {
    id: 41,
    src: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?auto=format&fit=crop&w=900&q=80',
    alt: 'Wildflowers in mountain field'
  },
  {
    id: 42,
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    alt: 'Foamy turquoise shoreline'
  },
  {
    id: 43,
    src: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=900&q=80',
    alt: 'Lakeside cabin at dusk'
  },
  {
    id: 44,
    src: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80',
    alt: 'Misty pathway in evergreen woods'
  },
  {
    id: 45,
    src: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&w=900&q=80',
    alt: 'Moody mountain landscape'
  },
  {
    id: 46,
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    alt: 'Alpine summit in clear weather'
  },
  {
    id: 47,
    src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=900&q=80',
    alt: 'Still water reflecting high peaks'
  },
  {
    id: 48,
    src: 'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?auto=format&fit=crop&w=900&q=80',
    alt: 'Curved road through green hills'
  },
  {
    id: 49,
    src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80',
    alt: 'Bridge crossing bright blue water'
  },
  {
    id: 50,
    src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80',
    alt: 'Sun rays in dense woodland'
  },
  {
    id: 51,
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    alt: 'Ridgeline under dramatic clouds'
  },
  {
    id: 52,
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    alt: 'Island beach with clear water'
  },
  {
    id: 53,
    src: 'https://images.unsplash.com/photo-1455218873509-8097305ee378?auto=format&fit=crop&w=900&q=80',
    alt: 'Aerial rocks and ocean spray'
  },
  {
    id: 54,
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80',
    alt: 'Road leading into mountain pass'
  },
  {
    id: 55,
    src: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=900&q=80',
    alt: 'Fog floating through pine forest'
  },
  {
    id: 56,
    src: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=900&q=80',
    alt: 'Stars across dark mountain sky'
  },
  {
    id: 57,
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    alt: 'Colorful sunset over mirror lake'
  },
  {
    id: 58,
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80',
    alt: 'Rolling blue ocean textures'
  },
  {
    id: 59,
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
    alt: 'Cloud blanket over valley'
  },
  {
    id: 60,
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    alt: 'Forest trail with warm light'
  },
  {
    id: 61,
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80',
    alt: 'Desert roadway to horizon'
  },
  {
    id: 62,
    src: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80',
    alt: 'Waves near rocky shoreline'
  },
  {
    id: 63,
    src: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80',
    alt: 'Path between tall misty trees'
  },
  {
    id: 64,
    src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
    alt: 'Forest mountains at blue hour'
  },
  {
    id: 65,
    src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
    alt: 'Soft evening light above ocean'
  },
  {
    id: 66,
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    alt: 'Lush canyon and waterfall drop'
  },
  {
    id: 67,
    src: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?auto=format&fit=crop&w=900&q=80',
    alt: 'Green mountain pasture'
  },
  {
    id: 68,
    src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80',
    alt: 'Scenic bridge and coastal bay'
  },
  {
    id: 69,
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    alt: 'Desert ridges under clear sky'
  },
  {
    id: 70,
    src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=900&q=80',
    alt: 'Mountain lake in crisp daylight'
  }
];

export default images;
