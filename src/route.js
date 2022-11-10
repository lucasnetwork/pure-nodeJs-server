class Route{
    route = {
        POST:{},
        DELETE:{},
        PUT:{},
        GET:{},
    }

    addRoute(name,functionMethod,method){
        if(name === "/"){
            this.route.GET.index = functionMethod
            return
        }
        let currentRoute = {...this.route[method]}
        let headcurrentRoute = currentRoute
        let headName = ''
        const urls = name.split("/").filter(name => name)

        urls.forEach((element,index) => {
            if(element === ""){
                return
            }
            currentRoute[element] = {}
            headName = element
            if(index+1 !== urls.length){
                headcurrentRoute = headcurrentRoute[element] 

            }
        });
        console.log(headcurrentRoute)
        headcurrentRoute[headName] = functionMethod
        this.route[method] = currentRoute
    }

    get(name,functionMethod){
        this.addRoute(name,functionMethod,"GET")
    }
    post(name,functionMethod){
        this.addRoute(name,functionMethod,"POST")
    }
    put(name,functionMethod){
        this.addRoute(name,functionMethod,"PUT")
    }
    delete(name,functionMethod){
        this.addRoute(name,functionMethod,"DELETE")
    }

}

module.exports  = Route