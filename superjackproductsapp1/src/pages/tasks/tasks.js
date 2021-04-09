import React from 'react';
import 'devextreme/data/odata/store';
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  Lookup,
  Selection
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';

function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== '';
}

const productStore = new CustomStore({
  key: 'id',
  load: function(loadOptions) {
    let params = '?';
    [
      'skip',
      'take',
      'requireTotalCount',
      'requireGroupCount',
      'sort',
      'filter',
      'totalSummary',
      'group',
      'groupSummary'
    ].forEach(function(i) {
      if (i in loadOptions && isNotEmpty(loadOptions[i]))
      { params += `${i}=${JSON.stringify(loadOptions[i])}&`; }
    });
    params = params.slice(0, -1);
    let skip = loadOptions['skip'];
    if(skip==null){
      skip = 0;
    }
    let take = loadOptions['take'];
    if(take==null){
      take = 10;
    }
    return fetch(`https://localhost:44397/products/pager/${skip}/${take}${params}`)
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        return {
          data: data.data,
          totalCount: data.totalCount,
          summary: data.summary,
          groupCount: data.groupCount
        };
      })
      .catch(() => { throw 'Data Loading Error'; });
  }
});

const store = new CustomStore({
  key: 'OrderNumber',
  load: function(loadOptions) {
    let params = '?';
    [
      'skip',
      'take',
      'requireTotalCount',
      'requireGroupCount',
      'sort',
      'filter',
      'totalSummary',
      'group',
      'groupSummary'
    ].forEach(function(i) {
      if (i in loadOptions && isNotEmpty(loadOptions[i]))
      { params += `${i}=${JSON.stringify(loadOptions[i])}&`; }
    });
    params = params.slice(0, -1);
    return fetch(`https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders${params}`)
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        return {
          data: data.data,
          totalCount: data.totalCount,
          summary: data.summary,
          groupCount: data.groupCount
        };
      })
      .catch(() => { throw 'Data Loading Error'; });
  }
});

function priceColumn_customizeText(cellInfo){
  return '£' + cellInfo.value;
};

function onSelectionChanged(e) {
  var currentSelectedRowKeys = e.currentSelectedRowKeys;
  var currentDeselectedRowKeys = e.currentDeselectedRowKeys;
  var allSelectedRowKeys = e.selectedRowKeys;
  var allSelectedRowsData = e.selectedRowsData;
  console.log(e);
  return e;
}



export default () => (
  

  <React.Fragment>
    <h2 className={'content-block'}>Products</h2>

<DataGrid
    dataSource={productStore}
    showBorders={false}
    remoteOperations={true}
    className={'dx-card wide-card'}
      focusedRowEnabled={true}
      defaultFocusedRowIndex={0}
      columnAutoWidth={true}
      columnHidingEnabled={true}
      onSelectionChanged={onSelectionChanged}
  >
     <Paging defaultPageSize={10} />
      <Pager showPageSizeSelector={true} showInfo={true} />
      <FilterRow visible={false} />
      <Selection mode="single" showCheckBoxesMode="none" />
    <Column
      dataField="id"
      dataType="number"
    />
    <Column
      dataField="name"
      dataType="string"
    />
    
    <Column
      dataField="itemPrice"
      dataType="number"
      format="currency"
      customizeText={priceColumn_customizeText}
    />
  
  </DataGrid>

    <h2 className={'content-block'}>Orders</h2>

    <DataGrid
        dataSource={store}
        showBorders={true}
        remoteOperations={true}
      >
        <Column
          dataField="OrderNumber"
          dataType="number"
        />
        <Column
          dataField="OrderDate"
          dataType="date"
        />
        <Column
          dataField="StoreCity"
          dataType="string"
        />
        <Column
          dataField="StoreState"
          dataType="string"
        />
        <Column
          dataField="Employee"
          dataType="string"
        />
        <Column
          dataField="SaleAmount"
          dataType="number"
          format="currency"
        />
        <Paging defaultPageSize={12} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[8, 12, 20]}
        />
      </DataGrid>

    <h2 className={'content-block'}>Tasks</h2>

    <DataGrid
      className={'dx-card wide-card'}
      dataSource={dataSource}
      showBorders={false}
      focusedRowEnabled={true}
      defaultFocusedRowIndex={0}
      columnAutoWidth={true}
      columnHidingEnabled={true}
    >
      <Paging defaultPageSize={10} />
      <Pager showPageSizeSelector={true} showInfo={true} />
      <FilterRow visible={true} />

      <Column dataField={'Task_ID'} width={90} hidingPriority={2} />
      <Column
        dataField={'Task_Subject'}
        width={190}
        caption={'Subject'}
        hidingPriority={8}
      />
      <Column
        dataField={'Task_Status'}
        caption={'Status'}
        hidingPriority={6}
      />
      <Column
        dataField={'Task_Priority'}
        caption={'Priority'}
        hidingPriority={5}
      >
        <Lookup
          dataSource={priorities}
          valueExpr={'value'}
          displayExpr={'name'}
        />
      </Column>
      <Column
        dataField={'ResponsibleEmployee.Employee_Full_Name'}
        caption={'Assigned To'}
        allowSorting={false}
        hidingPriority={7}
      />
      <Column
        dataField={'Task_Start_Date'}
        caption={'Start Date'}
        dataType={'date'}
        hidingPriority={3}
      />
      <Column
        dataField={'Task_Due_Date'}
        caption={'Due Date'}
        dataType={'date'}
        hidingPriority={4}
      />
      <Column
        dataField={'Task_Priority'}
        caption={'Priority'}
        name={'Priority'}
        hidingPriority={1}
      />
      <Column
        dataField={'Task_Completion'}
        caption={'Completion'}
        hidingPriority={0}
      />
    </DataGrid>
  </React.Fragment>
);

const dataSource = {
  store: {
    type: 'odata',
    key: 'Task_ID',
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks'
  },
  expand: 'ResponsibleEmployee',
  select: [
    'Task_ID',
    'Task_Subject',
    'Task_Start_Date',
    'Task_Due_Date',
    'Task_Status',
    'Task_Priority',
    'Task_Completion',
    'ResponsibleEmployee/Employee_Full_Name'
  ]
};

const priorities = [
  { name: 'High', value: 4 },
  { name: 'Urgent', value: 3 },
  { name: 'Normal', value: 2 },
  { name: 'Low', value: 1 }
];
