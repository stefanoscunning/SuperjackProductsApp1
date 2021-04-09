class ProductService{

    constructor(){

    }

    async retrieveItems() {
        return fetch(`https://localhost:44397/products`)
        .then(response =>{
            if(!response.ok){
                this.handleResponseError(response);
            }
            return response.json;
        })
        .then(json=>{
            console.log("Retrieved items:");
            console.log(json);
            return json;
        })
        .catch(error =>{
            this.handleError(error);
        });
    }

    handleResponseError(response) {
        throw new Error("HTTP error, status = " + response.status);
          }
          handleError(error) {
              console.log(error.message);
          }
}

export default ProductService;