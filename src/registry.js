export default class Registry {
    constructor() {
        this._registry = new Array();
        this._table = document.querySelector("#product");
    }

    add(product) {
        
        let pos = this._findProduct(product);

        if(pos >= 0){
            return false;
        }
        this._registry.push(product);
        this._show(product);
 
        return true;
    }

    _show(product) {
        let row = this._table.insertRow(1);

        let colId = row.insertCell(0);
        let colName = row.insertCell(1);
        let colUnit = row.insertCell(2);
        let colCost = row.insertCell(3);
        let colTotalCost = row.insertCell(4);
        let colActions = row.insertCell(5);

        row.setAttribute('id', `row${product.getId()}`);
        
        colId.setAttribute('id', `colId${product.getId()}`);
        colName.setAttribute('id', `colName${product.getId()}`);
        colUnit.setAttribute('id', `colUnit${product.getId()}`);
        colCost.setAttribute('id', `colCost${product.getId()}`);
        colTotalCost.setAttribute('id', `colTotalCost${product.getId()}`);
        colActions.setAttribute('id', `colActions${product.getId()}`);

        colId.innerHTML = product.getId();
        colName.innerHTML = product.getName();
        colUnit.innerHTML = product.getUnits();
        colCost.innerHTML = product.getCost();
        colTotalCost.innerHTML = product.getTotalCostNotIva();

        this._addActionButtons(colActions, product);

        document.querySelector("#iva").innerHTML = this.getIva();
        document.querySelector("#total").innerHTML = this.getTotalCosts();
        document.querySelector("#subtotal").innerHTML = this.getSubTotal();
    }

    _findProduct(product) {
        let pos = this._registry.findIndex((p) => {
            if(p.getId() === product.getId() ){
            return true;
            }
            return false;

        });

        return pos;
    }

    _addActionButtons(column, product){
        let btnUpdate = document.createElement('input');
        let btnDelete = document.createElement('input');

        btnUpdate.setAttribute('type', 'button');
        btnUpdate.setAttribute('value', 'modificar');
        btnUpdate.setAttribute('id', `btnU${product.getId()}`);
        
        btnDelete.setAttribute('type', 'button');
        btnDelete.setAttribute('value', 'eliminar');
        btnDelete.setAttribute('id', `btnD${product.getId()}`);

        column.appendChild(btnUpdate);
        column.appendChild(btnDelete);

        btnUpdate.addEventListener('click', () => {
            this._onUpdate(product);
        });

        btnDelete.addEventListener('click', () => {
            this._onDelete(product);
        });
    }

    _onUpdate(product){
        let colName = document.querySelector(`#colName${product.getId()}`);
        let colUnit = document.querySelector(`#colUnit${product.getId()}`);
        let colCost = document.querySelector(`#colCost${product.getId()}`);

        colName.innerHTML = '';
        colUnit.innerHTML = '';
        colCost.innerHTML = '';

        let inpName = document.createElement('input');
        let inpUnit = document.createElement('input');
        let inpCost = document.createElement('input');

        inpName.setAttribute('type', 'text');
        inpName.setAttribute('size', '35');
        inpName.setAttribute('value', product.getName());
        inpName.setAttribute('id', `inpName${product.getId()}`);

        inpUnit.setAttribute('type', 'text');
        inpUnit.setAttribute('size', '35');
        inpUnit.setAttribute('value', product.getUnits());
        inpUnit.setAttribute('id', `inpUnit${product.getId()}`);

        inpCost.setAttribute('type', 'number');
        inpCost.setAttribute('value', product.getCost());
        inpCost.setAttribute('id', `inpCost${product.getId()}`);

        colName.appendChild(inpName);
        colUnit.appendChild(inpUnit);
        colCost.appendChild(inpCost);

        this._addUpdateCancelButtons(product);
    }

    _addUpdateCancelButtons(product){
        let colActions = document.querySelector(`#colActions${product.getId()}`);
        colActions.innerHTML = '';
        let btnSave = document.createElement('input');
        let btnCancel = document.createElement('input');

        btnSave.setAttribute('type', 'button');
        btnSave.setAttribute('value', 'Grabar');
        btnSave.setAttribute('id', `btnS${product.getId()}`);

        btnCancel.setAttribute('type', 'button');
        btnCancel.setAttribute('value', 'Cancelar');
        btnCancel.setAttribute('id', `btnC${product.getId()}`);

        btnSave.addEventListener('click', () =>{
            this._onSave(product);
        })
        btnCancel.addEventListener('click', () =>{
            this._onCancel(product);
        })
        colActions.appendChild(btnSave);
        colActions.appendChild(btnCancel);
    }

    _onDelete(product){
        //borrar de la tabla 
        let row = document.querySelector(`#row${product.getId()}`);

        let cost = document.querySelector(`#colCost${product.getId()}`);
        row.remove();

        //borrar del vector

        let pos = this._findProduct(product);
        let costPos = this._registry[pos];
       // console.log(costPos._cost)
        //console.log(costPos._cost*costPos._units)
       //console.log(Number(document.querySelector("#total").innerHTML))

        document.querySelector("#total").innerHTML = document.querySelector("#total").innerHTML - (costPos._cost*costPos._units);
        console.log(document.querySelector("#total").innerHTML);

        document.querySelector("#iva").innerHTML = document.querySelector("#iva").innerHTML - (costPos._cost*costPos._units)*0.16;
        document.querySelector("#subtotal").innerHTML = document.querySelector("#subtotal").innerHTML - (costPos._cost*costPos._units)*0.84;
        
        this._registry.splice(pos, 1);

        return cost;
    }

    _onCancel(product) {
        let colName = document.querySelector(`#colName${product.getId()}`);
        let colUnit = document.querySelector(`#colUnit${product.getId()}`);
        let colCost = document.querySelector(`#colCost${product.getId()}`);
        let colTotalCost = document.querySelector(`#colTotalCost${product.getId()}`);
        let colIva = document.querySelector('#iva');
        let colTotal = document.querySelector('#total');
        let colSubTotal = document.querySelector('#subtotal');
        let colActions = document.querySelector(`#colActions${product.getId()}`);

        colName.innerHTML = product.getName();
        colUnit.innerHTML = product.getUnits();
        colCost.innerHTML = product.getCost();
        colTotalCost.innerHTML = product.getTotalCostNotIva();
        colIva.innerHTML = this.getIva();
        colTotal.innerHTML = this.getTotalCosts();
        colSubTotal.innerHTML = this.getSubTotal();
        colActions.innerHTML = '';

        this._addActionButtons(colActions, product);

        console.log(product);
        console.log(this._registry);
    }

    _onSave(product){
        let name = document.querySelector(`#inpName${product.getId()}`).value;
        let unit = document.querySelector(`#inpUnit${product.getId()}`).value;
        let cost = document.querySelector(`#inpCost${product.getId()}`).value;
        
        product.setName(name.toUpperCase());
        product.setUnits(unit.toUpperCase());
        product.setCost(Number(cost));

        this._onCancel(product);
    }

    getSubTotal(){
        let sum = 0;
        
        for (let i = 0; i < this._registry.length; i++) {
            sum = sum + this._registry[i].getTotalCostNotIva();
        }
        
        let sub = (sum * 84) / 100;

        return sub;
    }

    getIva(){
        let sum = 0;
        console.log(this._registry);
        
        for (let i = 0; i < this._registry.length; i++) {
            sum = sum + this._registry[i].getTotalCostNotIva();
        }
        
        let iva = (sum * 16) / 100;

        return iva;
    }

    getTotalCosts(){
        let sum = 0;
        console.log(this._registry);
        
        for (let i = 0; i < this._registry.length; i++) {
            sum = sum + this._registry[i].getTotalCostNotIva();
        }
        return sum;
    }

}