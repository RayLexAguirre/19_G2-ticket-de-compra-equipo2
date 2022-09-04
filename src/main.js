import Product from "./product.js";
import Registry from "./registry.js";

class App {
    constructor(){
    this._registry = new Registry();
    let btnRegister = document.querySelector("#btnRegister");
    btnRegister.addEventListener("click", this._addProduct);
    }

    _addProduct = () => {
        let product = Product.readForm();
        if(product === false){
            Swal.fire("Error", "Todos los campos son requeridos", "error");
            return;
        }
        let added = this._registry.add(product);
        if(added === false){
            Swal.fire("Error", "Producto ya registrado", "error");
            return;
        }
        Swal.fire("Correcto", "Se agregó un nuevo producto", "success");
    };
}

new App ();
