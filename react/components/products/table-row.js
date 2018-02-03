import React from 'react';
import { Glyphicon } from 'react-bootstrap';

export default class TableRow extends React.Component
{
  constructor(props) {
    super(props);

    // Вид единц валюты
    this.price = new Intl.NumberFormat(["ru-RU"], {
      style: "currency",
      currency: "RUB",
      currencyDisplay: "symbol",
      maximumFractionDigit: 2,
      minimumFractionDigits: 2
    });

    // Вид единиц количетва
    this.quantity = new Intl.NumberFormat(["ru-RU"], {
      style: "decimal",
      maximumFractionDigits: 1,
      minimumFractionDigits: 1
    });

    // Привязка
    this.clickOnAddToReport = this.clickOnAddToReport.bind(this);
    this.getID = this.getID.bind(this);
    this.clickOnID = this.clickOnID.bind(this);
    this.clickOnPriceIn = this.clickOnPriceIn.bind(this);
    this.clickOnProductName = this.clickOnProductName.bind(this);
  }

  // Формирование ссылки перехода к редактированию позиции и переход
  clickOnID(event) {
    event.preventDefault();
    this.goToAnchor("/product/", this.getID());
  }

  // Подготовка данных перед вызовом модального окна
  clickOnProductName(event) {
    event.preventDefault();
    this.props.addToCart(this.getID(), this.props.quantity);
  }

  // Внесение позиции в отчет по позиции или исключение,
  // изменение вида символа в зависимости от результата
  clickOnAddToReport(event) {
    const id = this.getID();
    const target = event.target;

    $.get({
      url: "/report-moving-products-list",
      data: {id: id}
    })
    .done(function(data) {
      if (data == 1) {
        target.classList.remove('glyphicon-plus');
        target.classList.add('glyphicon-ok');
      } else {
        target.classList.add('glyphicon-plus');
        target.classList.remove('glyphicon-ok');
      }
    });
  }

  // Формирование ссылки перехода к крайней накладной закупки товара и переход
  clickOnPriceIn(event) {
    event.preventDefault();
    this.goToAnchor("/invoice/", this.props.invoiceHash);
  }

  // Получение ID позиции
  getID() {
    return this.props.id;
  }

  // Функция формирования ссылки и перехода
  goToAnchor(where, val) {
    const mainLocation = document.location.origin;
    document.location.href = mainLocation+where+val;
  }


  render() {
    // Выборка переменных из this.props
    const { id, image, categoryName, categoryID, productName, storage_id, price_in, price_out, quantity, invoiceHash, quantityPart, onPrint } = this.props;

    let quantityClass = 'text-right';

    // формирование класса отображаемого объекта в зависимости от разрешений
    // применяется название в силу того, что приходит с сервера
    if(quantityPart > 0 && quantityPart <= 20 &&
      this.props.allows["Выделение остатков товара (закупка за 3 последних месяца)"]) {
      quantityClass = "text-right btn-danger";
    } else if (quantityPart > 20 && quantityPart < 50 &&
      this.props.allows["Выделение остатков товара (закупка за 3 последних месяца)"]) {
      quantityClass = "text-right btn-warning";
    }

    // Отображение Категории изделия, если выбраны "Все категории"
    let tdCategory = null;
    if(categoryID == 0) {
      tdCategory = <td style={{ whiteSpace: 'nowrap' }}>{categoryName}</td>
    }

    // Формирование начальных значений переменных
    let tdPriceIn = null;
    let priceOutClassName = 'text-right';
    const priceIn = this.price.format(price_in);

    // Если есть права на просмотр крайней накладной закупки, то вывод ссылки перехода
    if(this.props.allows["Просмотр цены закупки"] && onPrint == "false") {
      const lastInvoice = invoiceHash ? <a href="" onClick={this.clickOnPriceIn}>{priceIn}</a>  : priceIn;

      tdPriceIn = <td className="text-right">{lastInvoice}</td>
      if (price_out <= (price_in + price_in * 0.2)) {
        priceOutClassName = 'text-right btn-info';
      }
    }

    // Вывод ссылки на редактирование позиции если есть права, иначе ID позиции
    const tdID = this.props.allows["Редактирование товаров"] ? <a href="" onClick={this.clickOnID}>{id}</a> : id;

    // Если список для печати, то не выводить столбец в таблице
    const rowID = onPrint == "false" ? <td>{tdID}</td> : null;

    // Начальное значение для столбца
    let tdProductName = productName;

    // Если есть разрешения, то вывод кликабельной ссылки
    if((this.props.allows['Добавление товаров'] || this.props.allows['Перемещение товаров']) && onPrint == 'false') {
      tdProductName = <a href="" onClick={this.clickOnProductName}>{productName}</a>;
    }

    return (
      <tr key={id}>
        {rowID}
        {onPrint == "false" ? <td className="text-center"><a href={image} target="_blank"><Glyphicon glyph="picture" /></a></td> : null}
        {onPrint == "false" ? <td className="text-center"><Glyphicon onClick={this.clickOnAddToReport} glyph="plus" /></td> : null}
        {tdCategory}
        <td>{tdProductName}</td>
        {tdPriceIn}
        {onPrint == "false" ? <td className={priceOutClassName}>{this.price.format(price_out)}</td> : null}
        <td className={quantityClass}>{this.quantity.format(quantity)} шт/м</td>
      </tr>
    );
  }
}
