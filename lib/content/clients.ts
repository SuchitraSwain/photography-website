export type ClientLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
};

/** Partners and event clients featured on the homepage. */
export const CLIENT_LOGOS: ClientLogo[] = [
  {
    name: "Taandav Events",
    src: "/images/clients/taandav-events.png",
    width: 480,
    height: 480,
  },
  {
    name: "Navshakti Navratri",
    src: "/images/clients/navshakti-navratri.png",
    width: 480,
    height: 480,
  },
  {
    name: "Break Free",
    src: "/images/clients/break-free.png",
    width: 400,
    height: 400,
  },
];
