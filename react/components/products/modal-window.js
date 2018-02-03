import React from 'react';
// Импорт компонентов
import { Button, Modal, FormControl } from 'react-bootstrap';

export default class ModalWindow extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      quantity: 1.0,
      objectCount: 0,
      orderID: null,
      orderHash: null,
      dealerId: null
    };

    // Привязка
    this.onFocusInput = this.onFocusInput.bind(this);
    this.changeNumber = this.changeNumber.bind(this);
    this.getQuantity = this.getQuantity.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.saveClick = this.saveClick.bind(this);
  }

  componentDidMount() {
    // Проверка является ли вызываемый компонент обычным
    // или для редактирование "Черновика заказа"
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

  // Обновление значение при получении новых
  componentWillReceiveProps(nextProps) {
    const showModal = nextProps.showModal;

    if(showModal != this.state.showModal) {
        this.setState({ showModal: showModal, quantity: 1.0 });
    }
  }

  // Установка фокуса на input в модальном окне
  onFocusInput(event) {
    event.target.select();
  }

  // Применение значения при @change event, или вызов clickSave функции
  // при @keyup.enter event
  changeNumber(event) {
    this.setState({ quantity: event.target.value });
    if(event.keyCode == 13) {
      this.saveClick();
    }
  }

  // Закрытие модального окна
  close() {
    this.setState({ showModal: false });
  }

  //  Открытие модального окна
  open() {
    this.setState({ showModal: true });
  }

  saveClick(event) {
    this.close();

    // В зависимости окно вызвано для стандартных целей или
    // для редактирования Черновика, обращение по определенному пути
    let url = "/add-to-cart/";
    let data = {
      productID: this.props.productID,
      quantity: this.props.getQuantity()
    };

    if (this.state.objectCount == 3) {
      url = "/rough-copy-edit/";
      data = {
        productID: this.props.productID,
        quantity: this.props.getQuantity(),
        orderID: this.state.orderID,
        orderHash: this.state.orderHash,
        dealerID: this.state.dealerID
      };
    }

    // Если колиство товара в state проходит проверки, то выполняем запрос
    if (this.getQuantity() > 0 && this.getQuantity() <= this.props.productQuantity) {
      $.get({
        url: url,
        data: data
      }).done(function(response) {
        if(response === 1) {
          // выполнение процедур при нормальном выполнении на сервере
        }
      });
    }
  }

  // Получение количества для передачи на дальнейшую обработку
  getQuantity() {
    return this.state.quantity;
  }

  render() {

    return (
      <Modal ref="modalWindow"
        autoFocus={this.props.autoFocus}
        show={this.state.showModal} onHide={this.close}>

          <Modal.Header closeButton>
            <Modal.Title>Количество</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <FormControl onFocus={this.onFocusInput}
              max={this.props.productQuantity} min="0"
              onKeyUp={this.changeNumber} onChange={this.changeNumber}
              value={this.state.quantity} type="number"
              placeholder="Количество" autoFocus
            />
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.close}>Отмена</Button>
            <Button bsStyle="primary" active={true} onClick={this.saveClick}>
              Применить
            </Button>
          </Modal.Footer>
        </Modal>
    );
  }
}
