import {flatRoutes} from '@remix-run/fs-routes';
import {hydrogenRoutes} from '@shopify/hydrogen';

const routes = await flatRoutes();

export default hydrogenRoutes(routes);
