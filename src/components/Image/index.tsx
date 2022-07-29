import { Image as TaroImage } from '@tarojs/components';

export const Image = (props) => {
  console.log('props: ', props);
  return (
    <TaroImage {...props} />
  )
}

export default Image;
