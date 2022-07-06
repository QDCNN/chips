import { Image, View } from '@tarojs/components';
import styles from './index.module.less';
import classnames from 'classnames';

const Card = ({ className, image, onClick, children }) => {
  return (
    <View className={classnames(className, styles.card)} onClick={onClick}>
      <View className={styles.box}>
        {/* {children} */}
        <Image className={styles.image} src={image} mode="widthFix" />
      </View>
    </View>
  );
}

export default Card;
