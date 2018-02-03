import React from 'react';

// Заголовок страницы при печати

export default class StorageName extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      storageName: '',
      categoryName: '',
      style: {}
    };
  }

  // Изменение переменных при получении новых props данных
  componentWillReceiveProps(nextProps) {
    const storage = nextProps.storages.filter(( storage ) => {
      return storage.id === nextProps.storageID;
    });
    const category = nextProps.categories.filter(( category ) => {
      return category.id === nextProps.categoryID;
    });
    const categoryName = nextProps.categoryID == 0 ? 'Все категории' : category[0].name;
    this.setState({
      storageName: storage[0].name,
      categoryName: categoryName,
      style: nextProps.style
    });
  }

  render() {
    const date = new Date();

    return(
      <h4 style={this.state.style}>
        Склад: {this.state.storageName}, Категория: {this.state.categoryName}, ( {date.toLocaleString()} )
      </h4>
    );
  }
}
