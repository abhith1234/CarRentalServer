function createResult(error,data){
    const result={}
    if(error)
    {
        result.status='error'
        result.error=error
        console.log(error)
    }
    else{
        result.status='success'
        result.data=data
        console.log('success')
    }
    return result
}

module.exports={
    createResult:createResult
}