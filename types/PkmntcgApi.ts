export type PkmntcgApiCardResult = {
  id: string;
  name: string;
  number: string;
  set: {
    id: string;
  };
  images: {
    large: string;
  };
};

export type PkmntcgApiCardWithCount = PkmntcgApiCardResult & {
  count: number;
};

export type Collection = { [key: string]: PkmntcgApiCardWithCount };
