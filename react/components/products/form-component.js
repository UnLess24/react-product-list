import React from 'react';
// Импорт компонентов формы
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class FormComponent extends React.Component
{
  constructor(props) {
    super(props);

    // Присвоение функциям значения this
    this.change = this.change.bind(this);
  }

  // Значение при смене выбранного передается в компонент родитель
  change() {
    this.props.onChange(parseInt(this.selectInput.value));
  }

  render() {
    const style = {width: 200};

    // Текст на label компонента
    const labelText = this.props.labelText;

    // Формирование списка "options" для компонента Select
    const options = this.props.components.map(({ id, name }) => {
      return <option value={id} key={id}>{name}</option>
    });

    return(
      <FormGroup>
        <ControlLabel>{labelText}</ControlLabel>
        {' '}
        <FormControl value={this.props.defaultValue} onChange={this.change}
          inputRef={(select) => { this.selectInput = select; }}
          style={style} bsSize="small" componentClass="select"
          placeholder={labelText}>
          {options}
        </FormControl>
      </FormGroup>
    );
  }
}
