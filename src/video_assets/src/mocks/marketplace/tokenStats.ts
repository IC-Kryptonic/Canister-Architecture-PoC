interface TokenStats {
  marketCap: number;
  revenueLastWeek: number;
  priceChangeLastWeek: string;
}

const tokenStats = new Map<string, TokenStats>();

tokenStats.set('"Messi\'s goal was fantastic." Pep Guardiola reacts to PSG 2-0 Man City', {
  marketCap: 24,
  revenueLastWeek: 3.5,
  priceChangeLastWeek: '+ 1.25%',
});
tokenStats.set('Beyoncé - Halo', {
  marketCap: 33,
  revenueLastWeek: 4.5,
  priceChangeLastWeek: '- 2.7%',
});
tokenStats.set('CARDIO - Timmy Trumpet  Cardio Warm Up Routine I Pamela Reif', {
  marketCap: 50,
  revenueLastWeek: 2.8,
  priceChangeLastWeek: '+ 8.9%',
});
tokenStats.set('Estelle - American Boy [Feat. Kanye West] [Video]', {
  marketCap: 17,
  revenueLastWeek: 3,
  priceChangeLastWeek: '+ 3.4%',
});
tokenStats.set('Kanye West - Gold Digger ft. Jamie Foxx', {
  marketCap: 12,
  revenueLastWeek: 8,
  priceChangeLastWeek: '+ 4.1%',
});
tokenStats.set('Maroon 5 - Sugar (Official Music Video)', {
  marketCap: 22,
  revenueLastWeek: 2,
  priceChangeLastWeek: '- 7.4%',
});
tokenStats.set('NO TIME TO DIE | Final US Trailer', {
  marketCap: 10,
  revenueLastWeek: 4.2,
  priceChangeLastWeek: '+ 5.75%',
});
tokenStats.set('Remy: Bitcoin Billionaire', {
  marketCap: 39,
  revenueLastWeek: 3.2,
  priceChangeLastWeek: '+ 8.33%',
});
tokenStats.set('SNL "NFT\'S" LYRICS - Pete Davidson, Chris Redd, & Jack Harlow', {
  marketCap: 14,
  revenueLastWeek: 1,
  priceChangeLastWeek: '- 1.0%',
});
tokenStats.set('The Matrix Resurrections - Official Trailer 1', {
  marketCap: 31,
  revenueLastWeek: 0.8,
  priceChangeLastWeek: '+ 1.8%',
});
tokenStats.set('The history of the world according to cats - Eva-Maria Geigl', {
  marketCap: 18,
  revenueLastWeek: 5.6,
  priceChangeLastWeek: '+ 11.3%',
});
tokenStats.set('What the hell is an NFT? 🤓', {
  marketCap: 12,
  revenueLastWeek: 7.6,
  priceChangeLastWeek: '+ 10.2%',
});
tokenStats.set("World's smallest cat 🐈- BBC", {
  marketCap: 21,
  revenueLastWeek: 3.7,
  priceChangeLastWeek: '- 8.2%',
});
tokenStats.set('Encounter Noble Pokémon in Pokémon Legends: Arceus!', {
  marketCap: 14,
  revenueLastWeek: 3.2,
  priceChangeLastWeek: '+ 4.2%',
});
tokenStats.set("Kid Cudi - Day 'N' Nite", {
  marketCap: 28,
  revenueLastWeek: 2.8,
  priceChangeLastWeek: '+ 5.1%',
});

export { tokenStats };
