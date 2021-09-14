import { VideoToken } from '../../interfaces/token_interface';
import RonaldoThumbnail from '../../assets/images/thumbnail_ronaldo.png';
import LisaThumbnail from '../../assets/images/thumbnail_lisa.png';
import PortoThumbnail from '../../assets/images/thumbnail_porto.png';
import LissabonThumbnail from '../../assets/images/thumbnail_lissabon.png';
import AgostoThumbnail from '../../assets/images/thumbnail_agosto.png';

export const mockVideoTokens: Array<VideoToken> = [
  {
    id: '1',
    name: 'Ronaldo strikes as United hit Newcastle for four | Highlights | Manchester United 4-1 Newcastle',
    creator: 'Manchester United',
    marketCap: '$ 253,343',
    sharePrice: '$ 25',
    revenueLastWeek: '$ 7043',
    viewsLastWeek: '50,000',
    priceChangeLastWeek: '+ 1.32%',
    thumbnail: RonaldoThumbnail,
    link: 'https://www.youtube.com/embed/Ahnby2vUlxM',
    availableShares: 100,
    ownedShares: 27,
  },
  {
    id: '2',
    name: 'Highlights | Resumo: Santa Clara 0-5 Benfica (Liga 21/22 #5)',
    creator: 'VSPORTS - Liga Portugal Bwin',
    marketCap: '$ 253,343',
    sharePrice: '$ 25',
    revenueLastWeek: '$ 7043',
    viewsLastWeek: '50,000',
    priceChangeLastWeek: '+ 1.32%',
    thumbnail: LissabonThumbnail,
    link: 'https://www.youtube.com/embed/n3YCrNhC1ak',
    availableShares: 20,
    ownedShares: 2,
  },
  {
    id: '3',
    name: "LISA - 'LALISA' M/V",
    creator: 'BLACKPINK',
    marketCap: '$ 253,343',
    sharePrice: '$ 25',
    revenueLastWeek: '$ 7043',
    viewsLastWeek: '50,000',
    priceChangeLastWeek: '+ 1.32%',
    thumbnail: LisaThumbnail,
    link: 'https://www.youtube.com/embed/awkkyBH2zEo',
    availableShares: 30,
    ownedShares: 12,
  },
  {
    id: '4',
    name: 'RELATÓRIO DB - AGOSTO 2021',
    creator: 'Diogo Bataguas',
    marketCap: '$ 253,343',
    sharePrice: '$ 25',
    revenueLastWeek: '$ 7043',
    viewsLastWeek: '50,000',
    priceChangeLastWeek: '+ 1.32%',
    thumbnail: AgostoThumbnail,
    link: 'https://www.youtube.com/embed/llvKcrvHt3w',
    availableShares: 46,
    ownedShares: 42,
  },
  {
    id: '5',
    name: 'Highlights | Resumo: Sporting 1-1 FC Porto (Liga 21/22 #5)',
    creator: 'VSPORTS - Liga Portugal Bwin',
    marketCap: '$ 253,343',
    sharePrice: '$ 25',
    revenueLastWeek: '$ 7043',
    viewsLastWeek: '50,000',
    priceChangeLastWeek: '+ 1.32%',
    thumbnail: PortoThumbnail,
    link: 'https://www.youtube.com/embed/NmAPsC2zRPo',
    availableShares: 100,
    ownedShares: 3,
  },
];
