import { dispurtives, infinity, rocknblock } from '../../assets/images';

export const links = [
  {
    text: 'Link tree',
    link: 'https://linktr.ee/shipship.xyz',
  },
  {
    text: 'Help',
    link: 'https://shipship.gitbook.io/shipship/help/help',
  },
  {
    text: 'Terms of use',
    link: 'https://shipship.gitbook.io/shipship/terms-of-use',
  },
];

export const services = [
  {
    link: 'https://internetcomputer.org/',
    Image: <img src={infinity} alt="icp" css={{ width: 84, height: 45 }} />,
  },
  {
    link: 'https://disruptives.io/',
    Image: <img src={dispurtives} alt="dispurtives" css={{ width: 200, height: 47 }} />,
  },
  {
    link: 'https://rocknblock.io/',
    Image: <img src={rocknblock} alt="rocknblock" css={{ width: 181, height: 67 }} />,
  },
];
