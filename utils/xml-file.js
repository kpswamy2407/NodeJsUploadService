const { __extends }=require('tslib');
const { Base, BaseError }=require('./../core');
const fs=require('fs');
/**
 * 
 * @see 
 * @author nandhakumarviswanaathan@gmail.com.
 * @since Sun October 06, 2019 03:29 AM.
 */
var XmlFile=(function(){
	__extends(XmlFile,Base);
	function XmlFile(){
		Base.call(this);
	};
	XmlFile.IsValidDirectory=function(path){
		try{
			fs.accessSync(path);
			let stat=fs.statSync(path);
			return stat.isDirectory();
		} catch(err){
			return false;
		}
	};
	XmlFile.IsValidFile=function(path){
		try{
			fs.accessSync(path);
			let stat=fs.statSync(path);
			return stat.isFile();
		} catch(err){
			return false;
		}
	};
	XmlFile.MKDIR=function(path){
		if(this.IsValidFile(path)){
			throw new BaseError(`${path} is already a file.`);
		}
		if(this.IsValidDirectory(path)){
			return Promise.resolve(true);
		}
		return new Promise((rs,rj)=>{
			fs.mkdir(path,(err)=>{
				if(err){
					rj(new BaseError(err.message));
				} else{
					rs(true);
				}
			});
		});
	};
	XmlFile.prototype.basedir=null;
	XmlFile.prototype.module=null;
	XmlFile.prototype.content=null;
	XmlFile.prototype.fileName=null;
	XmlFile.prototype.date=null;
	XmlFile.prototype.absPath=function(){
		return `${this.basedir}/${this.module}/${this.date}/${this.fileName}.xml`;
	};
	XmlFile.prototype.validateBase=function(){
		if(!XmlFile.IsValidDirectory(this.basedir)){
			throw new BaseError('Base directory is NOT valid.');
		}
		return true;
	};
	XmlFile.prototype.mkModuleDir=function(){
		var path=`${this.basedir}/${this.module}`;
		return XmlFile.MKDIR(path).catch(err => {
			this.fatal(err.message);
			throw new BaseError(`Error while creating module directory.`);
		});
	};
	XmlFile.prototype.mkDateDir=function(){
		var path=`${this.basedir}/${this.module}/${this.date}`;
		return XmlFile.MKDIR(path).catch(err => {
			this.fatal(err.message);
			throw new BaseError(`Error while creating date directory.`);
		});
	};
	XmlFile.prototype.mkDirs=function(){
		return this.mkModuleDir().then(() => this.mkDateDir());
	};
	XmlFile.prototype.exists=function(){
		if(XmlFile.IsValidDirectory(this.absPath())){
			throw new BaseError('Path is already a directory.');
		}
		if(XmlFile.IsValidFile(this.absPath())){
			return true;
		}
		return false;
	};
	XmlFile.prototype.save=function(){
		this.validateBase();
		return this.mkDirs()
		.then(()=>{
			if(this.exists()){
				throw new BaseError('File already exists.');
			}
			return new Promise((rs,rj)=>{
				fs.writeFile(this.absPath(),this.content,(err)=>{
					if(err){
						this.fatal(err.message);
						rj(new BaseError('Unable to save file in the file system.'));
					} else{
						rs(true);
					}
				});
			});
		});
	};
	XmlFile.prototype.fetch=function(){
		// not needed as per the current requirement
	};
	XmlFile.prototype.delete=function(){
		// not needed as per the current requirement
	};
	return XmlFile;
})();
module.exports=exports=XmlFile;
