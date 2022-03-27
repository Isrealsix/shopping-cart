import { useState } from "react";
import { useQuery } from "react-query";
import { Drawer, LinearProgress, Grid, Badge } from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
import { Wrapper, StyledButton } from "./App.styles";
import { ICartItem } from "./model";
import Item from "./components/Item/Item";
import Cart from "./components/Cart/Cart";

const getProducts = async (): Promise<ICartItem[]> =>
  await (await fetch("https://fakestoreapi.com/products")).json();

const App = () => {
  const [cartIsOpen, setCartIsOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState([] as ICartItem[]);
  const { data, isLoading, error } = useQuery<ICartItem[]>(
    "products",
    getProducts
  );

  const getTotalItems = (items: ICartItem[]) =>
    items.reduce((acc, item) => acc + item.amount, 0);

  const handleAddToCart = (clickedItem: ICartItem) => {
    setCartItems((prev) => {
      const itemInCart = prev.find((item) => item.id === clickedItem.id);
      if (itemInCart) {
        return prev.map((item) =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      return [...prev, {...clickedItem, amount: 1}]
    });
  };
  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => (
      prev.reduce((acc, item) => {
        if (item.id === id) {
          if (item.amount === 1) return acc;
          return [...acc, {...item, amount: item.amount - 1}];
        } else {
          return [...acc, item]
        }
      }, [] as ICartItem[])
    ))
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong</div>;
  return (
    <Wrapper>
      <Drawer
        anchor="right"
        open={cartIsOpen}
        onClose={() => setCartIsOpen(false)}
      >
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartIsOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error"></Badge>
        <AddShoppingCart />
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
