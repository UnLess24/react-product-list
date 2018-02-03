import React from 'react';
import FormComponent from './form-component';
import Buttons from './buttons';
import { Form, Button } from 'react-bootstrap';

export default class TopForm extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      objectCount: 0,
      orderID: null,
      orderHash: null,
      dealerId: null
    };

    // Привязка
    this.changeStorage = this.changeStorage.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
    this.changeSettings = this.changeSettings.bind(this);
    this.onClickBackToOrderEdit = this.onClickBackToOrderEdit.bind(this);
  }

  // Проверка компонент обычный или для редактирования
  componentDidMount() {
    const search = window.location.search.substr(1),
        keys = {};
    search.split('&').forEach(function(item) {
        item = item.split('=');
        keys[item[0]] = item[1];
    });
    this.setState({
      objectCount: Object.keys(keys).length,
      orderID: keys['order_id'] || null,
      orderHash: keys['order_hash'] || null,
      dealerId: keys['dealer_id'] || null
    });
  }

  componentWillReceiveProps(nextProps) {
  }

  // Если список позиций для редактирования, то переход по ссылке в редактирование "Заказа"
  onClickBackToOrderEdit() {
    window.location = window.location.origin+'/order-edit/'+this.state.orderHash;
  }

  // Смена доп настроек (не используется)
  changeSettings(anotherSettingID) {
    this.props.onChange({ anotherSettingID });
  }

  // Смена склада
  changeStorage(storageID) {
    this.props.onChange({ storageID });
  }

  // Смена категории
  changeCategory(categoryID) {
    this.props.onChange({ categoryID });
  }

  render() {
    // Получение переменных из this.props
    const { categoryID, storageID, allows, categories, storages, onChangeProducts, anotherSettingID, anotherSettings } = this.props;

    let incomeLightButtons = '';
    let settings = null;
    let buttonOrderEdit = null;

    // Если есть доступ к маркеровке остатков, то маркеровать
    if(allows["Выделение остатков товара (закупка за 3 последних месяца)"]) {
      incomeLightButtons = <Buttons onChangeProducts={onChangeProducts} />;
    }

    // Если редактирование "Заказа", то вывод клавиши возврата к "Заказу"
    if(this.state.objectCount == 3) {
      buttonOrderEdit = <Button
        bsStyle="default"
        bsSize="small"
        className="pull-right"
        onClick={this.onClickBackToOrderEdit}
      >
        Назад, к редактированию Черновика
        </Button>
    }
    if(false) { //allows["Дополнительные параметры"]) {
      settings = (
        <FormComponent
          labelText=""
          components={anotherSettings}
          onChange={this.changeSettings}
          defaultValue={anotherSettingID}
        />);
    }

    return(
      <div>
        <Form inline>
          <FormComponent
            labelText="Категория"
            components={[{id: 0, name: "Все категории"}, ...categories]}
            onChange={this.changeCategory}
            defaultValue={categoryID}
          />
          {' '}
          <FormComponent
            labelText="Склад"
            components={storages}
            onChange={this.changeStorage}
            defaultValue={storageID}
          />
          {settings}
        </Form>
        {' '}
        {incomeLightButtons}
        {buttonOrderEdit}
      </div>
    );
  }
}
