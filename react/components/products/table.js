import React from 'react';
import { Table, Glyphicon } from 'react-bootstrap';
import TableRow from './table-row';

export default class TableComponent extends React.Component
{
  constructor(props) {
    super(props);
    // Формирование начальных значений без state
    this.products = [];
    this.categoryID = 0;
    this.storageID = 0;
    this.anotherSettingID = 0;
    this.allows = [];
    this.print = "false";

    // Привязка
    this.clickOnAddToReport = this.clickOnAddToReport.bind(this);
    this.getProductsIDs = this.getProductsIDs.bind(this);
    this.getProductsFilterStorage = this.getProductsFilterStorage.bind(this);
    this.getProductsFilterCategory = this.getProductsFilterCategory.bind(this);
    this.getProductsFilterQuantity = this.getProductsFilterQuantity.bind(this);
    this.getProductsFiltered = this.getProductsFiltered.bind(this);
    this.productsSort = this.productsSort.bind(this);
  }

  // Получение и присвоение новых значений props
  componentWillReceiveProps(nextProps) {
    if(nextProps != this.props) {
      if(nextProps.products != this.products) {
        this.products = nextProps.products;
      }
      if(nextProps.allows != this.allows) {
        this.allows = nextProps.allows;
      }
      this.anotherSettingID = nextProps.anotherSettingID;
      this.categoryID = nextProps.categoryID;
      this.storageID = nextProps.storageID;
      this.print = nextProps.onPrint;
      this.forceUpdate();
    }
  }

  // Получения товаров на данном складе
  getProductsFilterStorage() {
    return this.getProductsFilterQuantity().filter(( product ) => {
      return product.storage_id == this.storageID;
    });
  }

  // Получение товаров данной категории,
  // если категория не выбрана, все товары на данном складе
  getProductsFilterCategory() {
    if(this.categoryID > 0) {
      return this.getProductsFilterStorage().filter(( product ) => {
        return product.category_id == this.categoryID;
      });
    } else {
      return this.getProductsFilterStorage();
    }
  }

  // Функция сортировки по времени создания
  productsSort(obj1, obj2) {
    if(obj1.updated_at < obj2.updated_at) {
      return 1;
    } else if (obj1.updated_at > obj2.updated_at) {
      return -1;
    }
    return 0;
  }

  // Получение товаров по критерию количеств (не используется)
  getProductsFilterQuantity() {
    return this.products;
    let products = this.products;

    if (this.anotherSettingID == 1) {
      products = products.filter(( product ) => {
        return product.quantity == 0 && product.price_out > 0;
      });
      return products.sort(this.productsSort);
    } else {
    return this.products.filter(( product ) => {
      return product.quantity > 0 && product.price_out > 0;
    });
    }
  }

  // Получение товаров помеченных как 'warning', 'danger' или всех
  getProductsFiltered() {
    const products = this.getProductsFilterCategory();

    if(this.props.filterProducts == 'warning') {
      return products.filter(( product ) => {
        return product.quantity_part > 20 && product.quantity_part < 50;
      });
    } else if (this.props.filterProducts == 'danger') {
      return products.filter(( product ) => {
        return product.quantity_part > 0 && product.quantity_part <= 20;
      });
    }
    return products;
  }

  // Получение списка ID выведенных позиций
  getProductsIDs() {
    return this.getProductsFilterCategory().map(( product ) => {
      return product.id;
    });
  }

  // Внесение всех отображенных позиций в отчет
  clickOnAddToReport(event) {
    this.getProductsIDs().forEach((id) => {
      $.get({
        url: "/report-moving-products-list",
        data: {id: id}
      })
      .done(function(response) {
      });
    });
  }

  render() {
    const allows = this.allows;
    const width100 = {width: 100};
    const width120 = {width: 120};
    const width50 = {width: 50};
    const width25 = {width: 25};
    const addToCart = this.props.addToCart;
    let thisProducts = [];

    // Если доступны доп настройки (вывод позиций с 0 значением), то вывод (не используется)
    if(this.anotherSettingID == 2) {
      thisProducts = this.products.filter((product) => {
        return product.price_out == 0;
      });
    } else {
      thisProducts = this.getProductsFiltered();
    }

    // Формирование списка позиций
    const products = thisProducts.map(({ id, image, product_name, category_name, storage_id, price_in, price_out, quantity, invoice_hash, quantity_part }) => {

      return( <TableRow
              id={id}
              key={id}
              image={image}
              categoryName={category_name}
              categoryID={this.categoryID}
              storage_id={storage_id}
              price_in={price_in}
              price_out={price_out}
              quantity={quantity}
              productName={product_name}
              allows={allows}
              invoiceHash={invoice_hash}
              addToCart={addToCart}
              quantityPart={quantity_part}
              onPrint={this.print}
            />
      );
    });

    //  Вывод цены закупки если доступно
    let priceIn = null;
    if(allows["Просмотр цены закупки"] && this.print == "false") {
      priceIn = <th className="text-center" style={width100}>Закупка</th>
    }

    // Вывод категории, если выбраны все категории
    let category = null;
    if(this.categoryID == 0) {
      category = <th>Категория</th>
    }

    // Если список для печати, то не выводить столбец ID
    let rowID = null;
    if(this.print == "false") {
      rowID = <th style={width50}>ID</th>
    }
    // Если список для печати, то не выводить столбец "Цены продажи"
    let rowPriceOut = null;
    if(this.print == "false") {
      rowPriceOut = <th className="text-center" style={width100}>Цена</th>
    }

    // Если список для печати, то не выводить столбец "Изображения"
    let rowImage = null;
    if(this.print == "false") {
      rowImage = <th style={width25}></th>
    }

    // Если список для печати, то не выводить столбец "Внесения позиции в отчет"
    let rowGlyph = null;
    if(this.print == "false") {
      rowGlyph = <th className="text-center" style={width25}><a href="#" onClick={this.clickOnAddToReport}><Glyphicon glyph="plus" /></a></th>
    }

    return(
      <Table hover striped style={this.props.style}>
        <thead>
          <tr>
            {rowID}
            {rowImage}
            {rowGlyph}
            {category}
            <th>Наименование</th>
            {priceIn}
            {rowPriceOut}
            <th className="text-right" style={width120}>Кол-во</th>
          </tr>
        </thead>
        <tbody>
          {products}
        </tbody>
      </Table>
    );
  }
}
