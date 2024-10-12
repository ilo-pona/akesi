export interface Story {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  date: string;
  originalLink: string;
}

export const stories: Story[] = [
  {
    id: '1',
    title: 'pona sin li kama lon ma tomo',
    summary: 'ma tomo li jo e pona sin. jan ale li pilin pona.',
    content: 'ma tomo Akesi li jo e pona sin. jan mute li pali e tomo pona pi telo nasa ala. jan lili li ken musi lon ni. jan ale li pilin pona tan ni: ona li ken tawa lon ma pona ni. ni li pona tawa ma tomo en jan ale.',
    imageUrl: 'https://images.unsplash.com/photo-1518744826297-1c3b3edf6c96?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2024-03-15',
    originalLink: 'https://example.com/news/1'
  },
  {
    id: '2',
    title: 'kala sin li lon telo suli',
    summary: 'jan pi sona mute li lukin e kala sin lon telo suli.',
    content: 'jan pi sona mute li lukin e kala sin lon telo suli. kala ni li pona lukin li suli. ona li lon poka pi ma Akesi. jan ale li pilin pona tan ni: kala ni li pona tawa ma. ni li pona tawa sona pi ma ale.',
    imageUrl: 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2024-03-14',
    originalLink: 'https://example.com/news/2'
  },
  {
    id: '3',
    title: 'ma kasi sin li open',
    summary: 'ma tomo li jo e ma kasi sin. jan ale li ken tawa lon ona.',
    content: 'ma tomo Akesi li open e ma kasi sin. ma ni li suli li jo e kasi mute e telo suli. jan ale li ken tawa lon ona li ken musi lon ona. ni li pona tawa pilin pi jan ale li pona tawa ma.',
    imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2024-03-13',
    originalLink: 'https://example.com/news/3'
  },
  {
    id: '4',
    title: 'tomo sona sin li open',
    summary: 'ma tomo li jo e tomo sona sin. jan lili mute li ken kama sona lon ona.',
    content: 'tomo sona sin li open lon ma tomo Akesi. tomo ni li suli li pona lukin. jan lili mute li ken kama sona lon ona. jan pi pana sona li pona mute. ni li pona tawa jan lili en jan ale pi ma tomo.',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2024-03-12',
    originalLink: 'https://example.com/news/4'
  },
  {
    id: '5',
    title: 'musi suli li kama',
    summary: 'musi suli li kama lon ma tomo. jan ale li ken lukin e ona.',
    content: 'musi suli li kama lon ma tomo Akesi. jan mute tan ma ante li kama. ona li pali e kalama musi e musi suli. jan ale li ken kama li ken lukin e musi ni. ni li pona mute tawa jan ale pi ma tomo.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2024-03-11',
    originalLink: 'https://example.com/news/5'
  },
  {
    id: '6',
    title: 'jan pali li pona e nasin tawa',
    summary: 'jan pali li pona e nasin tawa lon ma tomo. ni li pona tawa jan ale.',
    content: 'jan pali li pona e nasin tawa lon ma tomo Akesi. ona li pali lon tenpo suli. jan ale li ken tawa pona lon nasin ni. ni li pona tawa jan ale pi ma tomo. jan li pilin pona tan ni: ona li ken tawa kepeken nasin pona.',
    imageUrl: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2024-03-10',
    originalLink: 'https://example.com/news/6'
  },
  {
    id: '7',
    title: 'kasi kule li open lon ma ale',
    summary: 'kasi kule mute li open lon ma ale. jan ale li pilin pona tan ni.',
    content: 'kasi kule mute li open lon ma ale pi ma tomo Akesi. ni li pana e pona lukin tawa ma tomo. jan ale li pilin pona tan ni: ona li lukin e kasi kule ni. jan mute li tawa lon ma tomo li lukin e kasi ni.',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2024-03-09',
    originalLink: 'https://example.com/news/7'
  }
];