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
    link: 'https://www.youtube.com/watch?v=Ahnby2vUlxM&ab_channel=ManchesterUnited',
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
    link: 'https://www.youtube.com/watch?v=n3YCrNhC1ak&ab_channel=VSPORTS-LigaPortugalBwin',
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
    link: 'https://www.youtube.com/watch?v=awkkyBH2zEo',
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
    link: 'https://www.youtube.com/watch?v=llvKcrvHt3w&ab_channel=DiogoBataguas',
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
    link: 'https://www.youtube.com/watch?v=NmAPsC2zRPo&ab_channel=VSPORTS-LigaPortugalBwin',
  },
];
