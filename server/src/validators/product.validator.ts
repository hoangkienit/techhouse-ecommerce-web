import Joi from "joi";

export const addProductSchema = () =>
  Joi.object({
    product_name: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .required()
      .messages({
        "string.base": "Tên sản phẩm phải là một chuỗi ký tự",
        "string.empty": "Tên sản phẩm không được để trống",
        "string.min": "Tên sản phẩm phải có ít nhất {#limit} ký tự",
        "string.max": "Tên sản phẩm không được vượt quá {#limit} ký tự",
        "any.required": "Tên sản phẩm là bắt buộc",
      }),

    product_brand: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .required()
      .messages({
        "string.base": "Tên thương hiệu phải là một chuỗi ký tự",
        "string.empty": "Tên thương hiệu không được để trống",
        "string.min": "Tên thương hiệu phải có ít nhất {#limit} ký tự",
        "string.max": "Tên thương hiệu không được vượt quá {#limit} ký tự",
        "any.required": "Tên thương hiệu là bắt buộc",
      }),

    product_description: Joi.string()
      .min(10)
      .required()
      .messages({
        "string.base": "Mô tả sản phẩm phải là một chuỗi ký tự",
        "string.empty": "Mô tả sản phẩm không được để trống",
        "string.min": "Mô tả sản phẩm phải có ít nhất {#limit} ký tự",
        "any.required": "Mô tả sản phẩm là bắt buộc",
      }),

    // product_slug: Joi.string().optional(),

    product_price: Joi.number()
      .positive()
      .required()
      .messages({
        "number.base": "Giá sản phẩm phải là một số",
        "number.positive": "Giá sản phẩm phải lớn hơn 0",
        "any.required": "Giá sản phẩm là bắt buộc",
      }),

    product_imgs: Joi.any().optional(),
    product_attributes: Joi.any().optional(),

    product_category: Joi.string()
      .valid("laptop", "phone", "tablet", "computer")
      .required()
      .messages({
        "any.only": "Danh mục sản phẩm phải là một trong: laptop, phone, tablet hoặc computer",
        "any.required": "Danh mục sản phẩm là bắt buộc",
      }),

    product_stock: Joi.number()
      .integer()
      .min(0)
      .required()
      .messages({
        "number.base": "Số lượng tồn kho phải là một số",
        "number.integer": "Số lượng tồn kho phải là số nguyên",
        "number.min": "Số lượng tồn kho không được nhỏ hơn {#limit}",
        "any.required": "Số lượng tồn kho là bắt buộc",
      }),

    // product_sold_amount: Joi.number()
    //   .integer()
    //   .min(0)
    //   .optional()
    //   .messages({
    //     "number.base": "Số lượng đã bán phải là một số",
    //     "number.integer": "Số lượng đã bán phải là số nguyên",
    //     "number.min": "Số lượng đã bán không được nhỏ hơn {#limit}",
    //   }),

    // product_status: Joi.string()
    //   .valid("active", "inactive")
    //   .optional()
    //   .messages({
    //     "any.only": "Trạng thái sản phẩm chỉ có thể là 'active' hoặc 'inactive'",
    //   }),
  }).unknown(true);

export const productQuerySchema = () => Joi.object({
  q: Joi.string().allow("", null),
  brand: Joi.alternatives().try(Joi.string()),
  category: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  // minRating: Joi.number().min(0).max(5),

  // sorting: name_asc | name_desc | price_asc | price_desc | relevance | newest
  sort: Joi.string().valid("name_asc","name_desc","price_asc","price_desc","relevance","newest").default("relevance"),

  // pagination
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
})
.custom((value, helpers) => {
  const { minPrice, maxPrice } = value;
  if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
    return helpers.error("any.invalid", { message: "minPrice cannot be greater than maxPrice" });
  }
  return value;
}, "price range check");

