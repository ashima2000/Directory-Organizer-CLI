#!/usr/bin/env node
let fs = require("fs");
let path = require("path");
let inputArr = process.argv.slice(2); 
let command =inputArr[0];
let types = {
    videos: ['mp4','mkv','3gp','avi','mov','m4v'],
    audios:['mp3','mpa','wav','wma'],
    images:['jpeg','png'],
    archives:['zip', '7z', 'rar', 'tar', 'gz', 'ar' , 'iso', 'xz'],
    documents:['docx','pdf','doc','xlsx','ppt','pptx','xls','odt','ods','odp','odf','txt','ps','tex'],
    program_file:['cpp','c','py','ipynb','js','jsx','json','r','html','css','md'],
    app:['exe', 'dmg','pkg','deb'] 
}
switch(command)
{
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1],inputArr[2]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log(`Please input the correct command from the given choices:
                              dirorg tree "directoryPath"
                              dirorg organize copy "directoryPath"
                              dirorg organize cut "directoryPath"
                              dirorg help
        `);
        break;
}

function treeFn(dirPath){

    //let destPath;
    if(dirPath == undefined){
        
        treeHelper(process.cwd(),"");
        return;
    }else{
        let doesExist = fs.existsSync(dirPath);
        if (doesExist){

        treeHelper(dirPath,"");
             
            
            // 2. create ->organized_files -> directory 
        }
        else{
            console.log("Please enter the correct path");
            return;
        }

    }
}

function treeHelper(dirPath,indent){
    // is file or folder
    let isFile=fs.lstatSync(dirPath).isFile();
    if(isFile==true){
        let fileName=path.basename(dirPath);
        console.log(indent +"├───"+ fileName);
    }
    //if its a directory
    else{
        let dirName=path.basename(dirPath);
        console.log(indent +"└───"+dirName);
        let children = fs.readdirSync(dirPath);
        for(let i=0;i<children.length;i++){
           let childPath =  path.join(dirPath,children[i]);
            treeHelper(childPath,indent+"\t");
        }
    }
}

function organizeFn(dup,dirPath){
    //console.log("Organize command implemented for ",dirPath);
    // 1. input ->directory path given
    let destPath;
    if(dup==undefined)
    {
        console.log("Enter Copy or Cut");
        return;
    }
    if(dirPath == undefined){
        //destPath = process.cwd();
        return;
    }else{
        let doesExist = fs.existsSync(dirPath);
        if (doesExist){
            destPath = path.join(dirPath,"Organized_Files");
            //if the file already exists then do nothing
            if(fs.existsSync(destPath)==false){
                fs.mkdirSync(destPath);
            }
            
            // 2. create ->organized_files -> directory 
        }
        else{
            console.log("Please enter the correct directory path");
            return;
        }

    }
    // jisko organize krna hai aur jahan organize krna hai (source,destination)
    organizeHelper(dup,dirPath, destPath);
    console.log("The Given Directory has been organized")

}
function organizeHelper(dup,src, dest){
    // 3. check all files -> which category they belong to 
    let childNames = fs.readdirSync(src); 
    let count=0;
    //console.log(childNames);
    for(let i=0;i<childNames.length;i++){
        let childAddress = path.join(src,childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            count++;
            //console.log(childNames[i]);
          let category = getCategory(childNames[i]);
          
     // 4. copy / cut files to that organized directory inside of any of category folder
     sendFiles(dup,childAddress,dest,category);

        }
    }
    console.log("Successfully moved ",count," files to respective folders");
}
function sendFiles(dup,srcFilePath,dest,category){
    
    let categoryPath=path.join(dest,category);
    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath);
    }
    let fileName=path.basename(srcFilePath);
    //pehle address bnate hai baad me vahan file put krte hai
    let destFilePath = path.join(categoryPath,fileName);
    fs.copyFileSync(srcFilePath,destFilePath);
    if(dup=="cut"){
    fs.unlinkSync(srcFilePath);}
    //console.log(fileName,"copied to " ,category);

}

function getCategory(name){
    let ext=path.extname(name);
    // to remove the dots that were coming in front od the extentions as we didn't put the dot above in types
    ext=ext.slice(1);
    //ek ek krke saari types media archieves vagara aa jaegi
    for(let type in types){
        let currTypeArray = types[type];
        for(let i=0;i<currTypeArray.length;i++){
            if(ext==currTypeArray[i]){
                return type;
            }
        }
    }
    return "others";
    //console.log(ext);
}
function helpFn(dirPath){
    console.log(`
    List of all the commands:
                   dirorg tree "directoryPath"
                   dirorg organize copy "directoryPath"
                   dirorg organize cut "directoryPath"
                   dirorg help
                   `);
}





 

