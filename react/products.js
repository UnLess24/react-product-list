import React from 'react';
import TableComponent from './components/products/table';
import TopForm from './components/products/topform';
import ModalWindow from './components/products/modal-window';
import StorageName from './components/products/storage-name-print';

export default class Products extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      // Список товаров
      products: [],
      // Список разрешений, приходит с сервера
      allows: [],
      // Список категорий
      categories: [],
      // Список складов
      storages: [],
      anotherSettings: [
        {id: 0, name: 'Без доп.сортировки', allow: 'all'},
        {id: 1, name: '0 количества', allow: 'Товары с 0 количества'},
        {id: 2, name: '0 цена отгрузки', allow: 'Просмотр списка позиций с 0 ценой отгрузки'},
      ],
      userID: 0,
      storageID: 0,
      categoryID: 0,
      anotherSettingID: 0,
      showModal: false,
      filterProducts: 'all',
    };
    this.productDataForModal = { productID: 0, productQuantity: 0 };

    // Привязка
    this.onProductAddToCart = this.onProductAddToCart.bind(this);
    this.changeSelect = this.changeSelect.bind(this);
    this.changeSelectedProducts = this.changeSelectedProducts.bind(this);
  }

  componentDidMount() {
    $.get({
      data: {},
      // URL запроса данных с back end
      url: "",
    })
    .done((data) => {
      this.setState(data);
    });
  }

  // При нажатии на имени товара заполнение и открытие модального окна
  onProductAddToCart(productID, productQuantity) {
    this.productDataForModal = { productID, productQuantity };
    this.setState({showModal: true});
  }

  changeSelect(data) {
    data.showModal = false;
    this.setState(data);
  }

   // Смена отображаемых товров в списке
  changeSelectedProducts(data) {
    data.showModal = false;
    this.setState(data);
  }

  render() {
    // Выборка переменных из state
    const { categoryID, storageID, allows, categories, storages, products, anotherSettings, anotherSettingID } = this.state;

    // Дле печати страницы смещение информации вверх
    const printStyle = { marginTop: -100 };

    // Если доступно управление доп функциями, то вывести их
    const settings = this.state.anotherSettings.filter((setting) => {
      return allows[setting.allow] || setting.allow == 'all';
    });

    return (
      <div>
        <div className="hidden-print">
          <ModalWindow
            showModal={this.state.showModal}
            productID={this.productDataForModal.productID}
            productQuantity={this.productDataForModal.productQuantity}
          />

          <TopForm
            categoryID={categoryID}
            storageID={storageID}
            anotherSettingID={anotherSettingID}
            anotherSettings={settings}
            allows={allows}
            categories={categories}
            storages={storages}
            onChange={this.changeSelect}
            onChangeProducts={this.changeSelectedProducts}
          />

          <TableComponent
            products={products}
            categoryID={categoryID}
            categories={categories}
            storageID={storageID}
            anotherSettingID={anotherSettingID}
            allows={allows}
            addToCart={this.onProductAddToCart}
            onPrint="false"
            filterProducts={this.state.filterProducts}
          />

        </div>
        <div className="visible-print-block">

          <StorageName
            style={printStyle}
            storages={storages}
            storageID={storageID}
            categoryID={categoryID}
            categories={categories}
          />

          <TableComponent
            products={products}
            categoryID={categoryID}
            categories={categories}
            storageID={storageID}
            allows={allows}
            addToCart={this.onProductAddToCart}
            onPrint="true"
            filterProducts={this.state.filterProducts}
          />
        </div>
      </div>
    );
  }
}
