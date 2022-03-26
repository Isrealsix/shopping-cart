import { Button } from "@material-ui/core";
import { ICartItem } from "../model";
import { Wrapper } from './Item.styles';

type Props = {
  item: ICartItem;
  handleAddToCart: (clickedItem: ICartItem) => void;
}

const Item: React.FC<Props> = ({item, handleAddToCart}) => (
    <Wrapper>
      <img src={item.image} alt={item.title} />
      <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <h3>${item.price}</h3>
      </div>
      <button onClick={() => handleAddToCart(item)}>Add to cart</button>
    </Wrapper>
);

export default Item;