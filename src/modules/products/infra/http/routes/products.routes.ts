import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProductsController from '../controllers/ProductsController';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.use(ensureAuthenticated);

productsRouter.get(
  '/',
  ensureAuthenticated,
  productsController.index,
);

productsRouter.get(
  '/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    }
  }),
  productsController.show,
);

productsRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      unit_measurement: Joi.string().required(),
    }
  }),
  productsController.create,
);

productsRouter.put(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.number().required(),
      name: Joi.string(),
      price: Joi.number(),
      quantity: Joi.number(),
      unit_measurement: Joi.string(),
    }
  }),
  productsController.update,
);

export default productsRouter;
