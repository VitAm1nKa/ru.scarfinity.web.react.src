import * as Redux       from 'redux';
import __request        from './__request';

import * as Account                 from './account';
import * as Catalog                 from './catalog';
import * as Filter                  from './filter';
import * as Cart                    from './cart';
import * as Navigation              from './navigation';
import * as Review                  from './review';
import * as ReviewCollection        from './reviewCollection';
import * as Product                 from './product';
import * as User                    from './user';
import * as Person                  from './person';
import * as SalesOrder              from './salesOrder';
import * as SalesOrders             from './salesOrders';
import * as RecenlyViewed           from './recenlyViewed';
import * as ShoppingCart            from './shoppingCart';
import * as ImageGallery            from './imageGallery';
import * as Shop                    from './shop';
import * as ProductCollection       from './productCollection';

export default Redux.combineReducers({
    account: Account.reducer,
    product: Product.reducer,
    catalog: Catalog.reducer,
    filter: Filter.reducer,
    cart: Cart.reducer,
    navigation: Navigation.reducer,
    review: Review.reducer,
    reviewCollection: ReviewCollection.reducer, 
    user: User.reducer,
    person: Person.reducer,
    salesOrder: SalesOrder.reducer,
    salesOrders: SalesOrders.reducer,
    recenlyViewed: RecenlyViewed.reducer,
    shoppingCart: ShoppingCart.reducer,
    imageGallery: ImageGallery.reducer,
    shop: Shop.reducer,
    productCollection: ProductCollection.reducer
})