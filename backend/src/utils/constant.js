const CURRENCY_MAP = {
  1: { abbreviation: "TWD", symbol: "NT$" },
  2: { abbreviation: "USD", symbol: "$" },
  3: { abbreviation: "USD", symbol: "$" },
  4: { abbreviation: "JPY", symbol: "¥" },
  5: { abbreviation: "GBP", symbol: "£" },
  6: { abbreviation: "AUD", symbol: "A$" },
  7: { abbreviation: "CAD", symbol: "C$" },
  8: { abbreviation: "CHF", symbol: "CHF" },
  9: { abbreviation: "CNY", symbol: "CN¥" },
  10: { abbreviation: "HKD", symbol: "HK$" },
};

const AVATAR_LINK = "https://dxkgfgg79h3hz.cloudfront.net/avatars/";
const DEFAULT_AVATAR = [
  "bear.png",
  "dolphin.png",
  "koala_avatar.jpg",
  "sheep.png",
  "beaver.png",
  "duck.png",
  "lion_avatar.jpg",
  "sloth.png",
  "bird.png",
  "fox_avatar.jpg",
  "mouse.png",
  "stegosaurus.png",
  "cat.png",
  "frog.png",
  "owl.png",
  "tiger.png",
  "chicken.png",
  "ganesha.png",
  "panda.png",
  "tiger_avatar.jpg",
  "cow1.png",
  "giraffe.png",
  "parrot.png",
  "turtle.png",
  "cow2.png",
  "gorilla.png",
  "penguin.png",
  "weasel.png",
  "crab.png",
  "gorilla_avatar.jpg",
  "pig.png",
  "whale.png",
  "deer.png",
  "hedgehog.png",
  "puffer-fish.png",
  "wolf_avatar.jpg",
  "dog.png",
  "hippo.png",
  "rabbit_avatar.jpg",
  "dog_avatar.jpg",
  "jellyfish.png",
  "sea-lion.png",
];

const AWS_CLOUDFRONT_HOST = "https://dxkgfgg79h3hz.cloudfront.net/";

export { CURRENCY_MAP, AWS_CLOUDFRONT_HOST, AVATAR_LINK, DEFAULT_AVATAR };
