let fs= require('fs');
let path=require('path')

class Contenedor {
    constructor(url){
        this.url=url
    }

    async save(product){
        try {
            let productos= await this.getAll()
            let newID= await this.newId(productos)
            let newProducto={
                id:newID,
                ...product
            }
            productos.push(newProducto)
            let cont=JSON.stringify(productos,null,2)
            await fs.promises.writeFile(`${this.url}`, cont)
            return newProducto;
        } catch (error) {
            console.log(error)
        }
    }

    async newId(producto){
        let idMomento=producto.reduce((prev,actual)=>{
            if(actual.id<prev){
                return prev
            }
            return actual.id
        },0)
        return idMomento+1
    }
    
    async getById(id){
        try {
            let res=null
            let productos= await this.getAll()
            if (productos.length>0) {
                productos.forEach(element => {
                    if (element.id == id) {
                        res=element
                    }
                });
            }
            return res
        } catch (error) {
            console.log(error)
        }
    }

    async getAll(){
        try {
            let productos= await fs.promises.readFile(`${this.url}`, 'utf-8')
            return JSON.parse(productos)
        } catch (error) {
            console.log(error)
        }
    }
    
    async deleteById(id){
        try {
            let productos= await this.getAll()
            let productosNuevos=productos.filter(x=>x.id!=id)
            let productoEliminado=productos.filter(x=>x.id==id)
            let contenido=JSON.stringify(productosNuevos,null,2)
            await fs.promises.writeFile(`${this.url}`,contenido)
            return productoEliminado
        } catch (error) {
            console.log(error)
        }
    }

    async update(id){
        try {
            let productos= await this.getAll()
            if (productos.length>0) {
                productos.forEach(element => {
                    if (element.id==id) {
                        let posId=id-1
                        let newProduct={
                            id: id,
                            title: "lentes",
                            price: 2500,
                            thumbnail: "url"
                        }
                        productos.splice(posId,1,newProduct)
                    }
                });
            }
            let cont=JSON.stringify(productos,null,2)
            await fs.promises.writeFile(`${this.url}`, cont)
            return productos
        } catch (error) {
            console.log(error)
        }
    } 

    async deleteAll(){
        try {
            await fs.promises.writeFile(`${this.url}`, '[]')
        } catch (error) {
            console.log(error)
        }
    }  
}

module.exports=Contenedor