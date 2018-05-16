import React            from 'react';
import {
    Route,
    Redirect,
    Switch,
    NavLink
}                       from 'react-router-dom';
import { matchPath }    from 'react-router';
import { connect }      from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme      from 'material-ui/styles/getMuiTheme';

import                       'whatwg-fetch';
import PropTypes        from 'prop-types';

import Layout           from './pages/__shared/Layout';
import * as Grid        from './lib/grid';

import Develop          from './develop';

import * as DefPages    from './pages/DefaultPages';
import Home             from './pages/Home';
import CatalogOverview  from './pages/CatalogOverview';
import Catalog          from './pages/Catalog';
import CatalogWrap      from './pages/CatalogWrap';
import ProductCard      from './pages/ProductCard';
import Cart             from './pages/Cart';
import Personal         from './pages/Personal';
import Contacts         from './pages/Contacts';
import Tmp              from './pages/Tmp';
import Login            from './pages/Login';
import BreadCrumbs      from './pages/BreadCrumbs';
import EmptyPage        from './pages/Empty';

import * as 
    NavigationStore     from './store/navigation';


const muiTheme = getMuiTheme({
    userAgent: 'all',
});

const viewContainer = (props, view) => {
    if(view.content === '404') return <DefPages.Default404 />;
    if(view.component != null) return <view.component {...props} />
    if(view.component == null) return <DefPages.DefaultContentDev info={view.content} />;
}

const Routing = connect(state => ({root: state.navigation.root}))((props) => {
    const pathName = props.location.pathname;
    const search = props.location.search;
    const nodes = pathName.substr(1).replace(/\/$/, "").split('/');
    const view = viewProps => viewContainer(props, viewProps);

    //  -- Домашняя
    //  ----------------------------------------------------------------  
    if(pathName === '/') {
        // Рутовый элемент
        // Домашняя страница
        return view({
            path: '/',
            content: 'home',
            component: Home
        })
    }

    //  -- Каталог
    //  ----------------------------------------------------------------   
    if(nodes[0] === 'catalog') {
        // Карточка товара
        // Поиск товара по номеру модели
        // Фильтр: f-clf0-cl00 f-(тип)-(значение)
        const lastNode = _.last(nodes);
        const firstNode = _.first(_.tail(nodes));
        let catalogPath = '/catalog';
        let filterQuery = null;

        // Товар
        if(!isNaN(lastNode.charAt(0))) {
            // Проверяем, существует ли такой товар
            const productModel = lastNode;
            
            if(true) {
                // `/catalog/category/group/type/${productModel}`;
                const productPath = `/catalog/ladies/sharfy_platki_palantini/sharfy/${productModel}`; 
                const productPathS = `/catalog/ladies/sharfy_platki_palantini/sharfy/:id`;

                // Проверяем, правильно ли указана ссылка на товар
                if(matchPath(productPath, {path: pathName, exact: true})) {
                    return <Route path={productPathS} component={ProductCard} />
                    return view({
                        path: pathName,
                        content: 'product',
                        component: ProductCard
                    })
                } else {
                    return <Redirect push to={`${productPath}${search}`} />
                }
            }

            return view({
                path: pathName,
                content: '404'
            })
        }

        // Фильтры
        if(lastNode.length >= 2 && lastNode.charAt(0) === 'f' && lastNode.charAt(1) === '-') {
            // ../f-
            const filterProps = lastNode.substr(2).split('-');

            let filters = [];
            _.each(filterProps, filter => {
                // Протокол фильтра
                // Две лидирующие буквы - тип фильтра: bs(BS), ct(CT), ...
                // Остальные - тело фильтра: XX55 -> 55
                if(filter.length >= 3 && isNaN(filter.charAt(0)) && isNaN(filter.charAt(1))) {
                    filters = [...filters, {
                        type: filter.substr(0, 2).toLowerCase(),
                        body: filter.substr(2).toLowerCase()
                    }]
                }
            })

            if(filters.length > 0) {
                filterQuery = `f-${_.join(_.map(filters, filter => `${filter.type}${filter.body}`), '-')}`;
                // dispatch()
            }
        }

        // Новинки и Акции
        if(firstNode != null) {
            if(firstNode == 'new') return view({
                path: '/catalog/new',
                content: 'new'
            })
            if(firstNode == 'sale') return view({
                path: '/catalog/sale',
                content: 'sale'
            })
        }

        // Каталог
        // Проверяем существование ноды каталога
        // Глубина каталога определена: 3 в глубину
        // category -> group -> type
        // Сочетание с фильтром: на любом этапе
        const catalogNodes = _.take(_.tail(filterQuery ? _.initial(nodes) : nodes), 3);
        if(catalogNodes.length > 0) {
            let currentNode = _.find(props.root.nodes, {seo: 'catalog'});
            let fetchError = null;

            _.each(catalogNodes, node => {
                if(currentNode) {
                    const navigationNode = _.find(currentNode.nodes, {seo: node});
                    if(navigationNode) {
                        catalogPath = `${catalogPath}/${node}`;
                        currentNode = navigationNode;
                    } else {
                        // Ошибка поиска, вернуть 404
                        fetchError = 'search';
                        return false;
                    }
                } else {
                    // Ошибка поиска в глубину, вернуть все удачные
                    return false;
                }
            })

            if(!fetchError) {
                if(filterQuery) catalogPath = `${catalogPath}/${filterQuery}`;

                if(matchPath(catalogPath, {path: pathName, exact: true})) {
                    return view({
                        path: catalogPath,
                        content: 'catalog',
                        component: Catalog
                    })
                } else {
                    return <Redirect push to={`${catalogPath}${search}`} />
                }
            } else {
                return view({content: '404'})
            }
        }

        // Overview Каталога
        if(matchPath(catalogPath, {path: pathName, exact: true})) {
            return view({
                path: catalogPath,
                content: 'catalog_overview',
                component: CatalogOverview
            })
            
        }
    }

    //  -- Корзина
    //  ----------------------------------------------------------------  
    if(nodes[0] === 'cart') {
        //Корзина товаров
        return view({
            path: '/cart',
            content: 'cart',
            component: Cart
        })
    }

    //  -- Информация
    //  ----------------------------------------------------------------  
    if(nodes[0] === 'info') {
        return view({
            path: '/info',
            content: 'info'
        })
    }

    //  -- 404
    //  ----------------------------------------------------------------  
    return view({content: '404'})
})


const RouteComponents = (props) => {
    return(
        <DefPages.Default404 />
    )
}

export const Routes = (props) => {
    return(
        <MuiThemeProvider muiTheme={muiTheme}>
            <Layout>
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/dev' component={Develop} />
                    <Route path='/catalog' exact component={CatalogOverview} />
                    <Route path='/catalog/:search' component={CatalogWrap} />
                    <Route path='/cart' component={Cart} />
                    <Route path='/personal' component={Personal} />
                    <Route path='/contacts' exact component={Contacts} />
                    <Route path='/contacts/:id' component={Contacts} />
                    <Route path='/tmp' component={Tmp} />
                    <Route path='/login' component={Login} />
                    <Route path='/bread' component={BreadCrumbs} />
                    <Route path='/empty' component={EmptyPage} />
                    <Route component={RouteComponents} />
                </Switch>
            </Layout>
        </MuiThemeProvider>
    )
}

export const rotes = Routes;
