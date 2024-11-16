const fs = require("fs");
const path = require('path');
 
const postsFilePath = path.join(__dirname, 'data', 'posts.json');
const categoriesFilePath = path.join(__dirname, 'data', 'categories.json');

let posts = [];
let categories = [];

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile(postsFilePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                posts = JSON.parse(data);

                fs.readFile(categoriesFilePath, 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        categories = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    });
}

module.exports.getAllPosts = function(){
    return new Promise((resolve,reject)=>{
        (posts.length > 0 ) ? resolve(posts) : reject("no results returned"); 
    });
}

module.exports.getPostsByCategory = function(category){
    return new Promise((resolve,reject)=>{
        let filteredPosts = posts.filter(post=>post.category == category);

        if(filteredPosts.length == 0){
            reject("no results returned")
        }else{
            resolve(filteredPosts);
        }
    });
}

module.exports.getPostsByMinDate = function(minDateStr) {
    return new Promise((resolve, reject) => {
        let filteredPosts = posts.filter(post => (new Date(post.postDate)) >= (new Date(minDateStr)))

        if (filteredPosts.length == 0) {
            reject("no results returned")
        } else {
            resolve(filteredPosts);
        }
    });
}

module.exports.getPostById = function(id){
    return new Promise((resolve,reject)=>{
        let foundPost = posts.find(post => post.id == id);

        if(foundPost){
            resolve(foundPost);
        }else{
            reject("no result returned");
        }
    });
}

module.exports.addPost = function(postData){
    return new Promise((resolve,reject)=>{
        postData.published = postData.published ? true : false;
        postData.id = posts.length + 1;
        
        postData.postDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
        
        posts.unshift(postData); 
        
        resolve();
    });
}

module.exports.getPublishedPosts = function(){
    return new Promise((resolve,reject)=>{
        let filteredPosts = posts.filter(post => post.published);
        (filteredPosts.length > 0) ? resolve(filteredPosts) : reject("no results returned");
    });
}

module.exports.getPublishedPostsByCategory = function(category) {
    return new Promise((resolve, reject) => {
        let filteredPosts = posts.filter(post => post.published && post.category == category);
        (filteredPosts.length > 0) ? resolve(filteredPosts) : reject("no results returned for the specified category");
    });
};

module.exports.getCategories = function(){
    return new Promise((resolve,reject)=>{
        (categories.length > 0 ) ? resolve(categories) : reject("no results returned"); 
    });
}