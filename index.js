let express= require("express")
let path=require('path')
let {Router}= express

const app =express()
const router1= new Router()
const id_router= new Router()

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const PORT=8080
let Contenedor=require('./components/contenedor/contenedor')
let contenedor= new Contenedor('./components/products/productos.txt')

app.get("/",(req,res)=>{
    res.send("primer servidor con express")
})

router1.get("/",async (req,res, next)=>{
    await contenedor.getAll().then(productos=>{
        if(productos){
            res.json(productos)
        }else{
            res.json({"error":"id inexistente"})
        }
    }).catch(err=>{
        res.send(err)
    })
})

router1.post("/",async (req,res, next)=>{
    await contenedor.save(req.body.producto).then(productos=>{
        if(productos){
            res.json(productos)
        }else{
            res.json({"error":"id inexistente"})
        }
    }).catch(err=>{
        res.send(err)
    })
})

id_router.get("/:id",async (req,res, next)=>{
    let id= req.params.id
    await contenedor.getById(id).then(productId=>{
        if(productId){
          res.json(productId)
        }else{
            res.json({"error":"id inexistente"})
        }
    }).catch(error=>{
        res.send(error)
    })
})

router1.delete("/:id",async (req,res,next)=>{
    let id= req.params.id
    await contenedor.deleteById(id).then(productId=>{
        if(productId){
          res.json(productId)
        }else{
            res.json({"error":"id inexistente"})
        }
    }).catch(error=>{
        res.send(error)
    })
})

id_router.put("/:id",async (req,res,next)=>{
    await contenedor.update(req.params.id).then(productos=>{
       if (productos) {
            res.json(productos) 
       } else {
            res.json({"error":"id inexistente"})
       }
    }).catch(err=>{
        res.send(err)
    })
}) 


app.use('/api/productos',router1)
app.use('/api/productos',id_router)
app.use('/api',express.static(path.join(__dirname,'public','index.html')))


app.listen(PORT,()=>{
    console.log(`Mi servidor escuchando desde http://localhost:${PORT}`)
})