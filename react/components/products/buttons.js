import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

export default class Buttons extends React.Component
{
  constructor(props) {
    super(props);

    // Привязка
    this.onClickWarning = this.onClickWarning.bind(this);
    this.onClickDanger = this.onClickDanger.bind(this);
    this.onClickDefault = this.onClickDefault.bind(this);
  }

  // Отбражение позициj со стасусом 'warning'
  onClickWarning() {
    this.props.onChangeProducts({ filterProducts: 'warning' });
  }

  // Отбражение позиций со стасусом 'danger'
  onClickDanger() {
    this.props.onChangeProducts({ filterProducts: 'danger' });
  }

  // Отбражение всех позиций
  onClickDefault() {
    this.props.onChangeProducts({ filterProducts: 'all' });
  }

  render() {
    return(
      <ButtonGroup>
        <Button bsStyle="default" bsSize="small" onClick={this.onClickDefault}>Все</Button>
        <Button bsStyle="warning" bsSize="small" onClick={this.onClickWarning}>Обратить внимание</Button>
        <Button bsStyle="danger" bsSize="small" onClick={this.onClickDanger}>Осталось мало</Button>
      </ButtonGroup>
    );
  }
}
