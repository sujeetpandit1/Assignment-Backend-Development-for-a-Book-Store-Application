const generateSlug = (inputString) =>{
    return inputString
      .toLowerCase()
      .replace(/[^\w\s]/g, '')    
      .replace(/\s+/g, '-')   
      .trim();              
  }

  const  generateSlugWithPrefix = (inputString, prefix) => {
    return `${prefix}-${inputString}`
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')     
      .replace(/\s+/g, '-')       
      .trim();                   
  }

module.exports= {generateSlug, generateSlugWithPrefix};

