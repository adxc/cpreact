import { createPublicInstance } from "./component";

let rootInstance = null;

function render(element, container) {
    const preInstance = rootInstance;
    const nextInstance = reconcile(container, preInstance, element);
    rootInstance = nextInstance
}

function reconcile(parentDom, instance, element) {
    if(instance == null) {
        //生成instance
        const  newInstance = instantiate(element);
        parentDom.appendChild(newInstance.dom);
        return newInstance;
    }else if(element == null) {
        //删除 instance
        parentDom.removeChild(instance.dom);
        return null;
    }else if (instance.element.type !== element.type) {
        //替换instance
        const newInstance = instantiate(element);
        parentDom.replaceChild(newInstance.dom, instance.dom);
        return newInstance;
    }
    else if (typeof element.type  === "string"){
        //更新instance
        updateDomProperties(instance.dom,instance.element.props,element.props);
        instance.childInstances = reconcileChildren(instance, element);
        instance.element = element;
        return instance
    }else {
        // 更新组件
        instance.publicInstance.props = element.props;
        const childElement = instance.publicInstance.render();
        const oldChildInstance = instance.childInstance;
        const childInstance = reconcile(parentDom,oldChildInstance,childElement);
        instance.dom = childInstance.dom;
        instance.childInstance = childInstance;
        instance.element = element;
        return instance;
    }
}
function reconcileChildren (instance, element) {
    const dom = instance.dom;
    const childInstances = instance.childInstances;
    const nextChildElements = element.props.children || [];
    const newChildInstances = [];
    const count = Math.max(childInstances.length, nextChildElements.length);
    for(let i = 0; i< count; i++){
        const childInstance = childInstances[i];
        const childElement = nextChildElements[i];
        const newChildInstance = reconcile(dom, childInstance, childElement);
        newChildInstances.push(newChildInstance);
    }
    return newChildInstances.filter(instance => instance != null);
}
function instantiate(element){
    const { type, props} = element;
    const isDomElement = typeof type === 'string';
    
    if(isDomElement) {
        //创建dom元素
        const isTextElement = type === 'TEXT ELEMENT'
        const dom = isTextElement ? document.createTextNode(""):document.createElement(type);

        updateDomProperties(dom,[],props);

        //实例化instance并添加子元素
        const childElements = props.children || [];
        const childInstances = childElements.map(instantiate);
        const childDoms = childInstances.map(childInstance => childInstance.dom);
        childDoms.forEach(childDom => dom.appendChild(childDom));

        const instance = {dom, element, childInstances};

        return instance;
    } else {
        //实例化组件元素
        const instance = {};
        const publicInstance = createPublicInstance(element, instance);
        const childElement = publicInstance.render();
        const childInstance = instantiate(childElement);
        const dom = childInstance.dom;

        Object.assign(instance,{dom,element,childInstance, publicInstance});
        return instance;
    }
}

//更新dom属性
function updateDomProperties(dom, prevProps,nextProps) {
    const isEvent = name => name.startsWith('on');
    const isAttribute = name => !isEvent(name) && name != 'children';

    //移除事件监听
    Object.keys(prevProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
    })

    //移除dom属性
    Object.keys(prevProps).filter(isAttribute).forEach(name => {
        dom[name] = null;
    })
    
    //设置dom属性
    Object.keys(nextProps).filter(isAttribute).forEach(name => {
        dom[name] = nextProps[name];
    });

    //添加事件监听
    Object.keys(nextProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
    })
}
// function render(element, parentDom) {
//     const {type, props}  = element;
//     //创建dom元素
//     const isTextElement = type === 'TEXT ELEMENT'
//     const dom = isTextElement ? document.createTextNode(""):document.createElement(type);
    
//     //添加事件监听
//     const isListener = name => name.startsWith('on');
//     Object.keys(props).filter(isListener).forEach(name => {
//         const eventType = name.toLowerCase().substring(2);
//         dom.addEventListener(eventType,props[name])
//     })

    //设置元素属性
    // const isAttribute = name => !isListener(name) && name != 'children';
    // Object.keys(props).filter(isAttribute).forEach(name => {
    //     dom[name] = props[name]
    // })

//     //渲染子元素
//     const childElements = props.children || [];
//     childElements.forEach(element => {
//         render(element,dom)
//     });

//     //添加到父节点
//     parentDom.appendChild(dom)
// }

export {render,reconcile}