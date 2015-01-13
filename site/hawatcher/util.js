/**
 * 判断两个容器数组是否相同（仅根据容器id集合是否完全一致）
 * @param arr1
 * @param arr2
 */
exports.isSame = function(arr1, arr2){
    if( isSubset(arr1, arr2) && isSubset(arr2, arr1) )
        return true;
    return false;
};

/**
 * 判断集合arr1是否包含在arr2中
 * @param arr1
 * @param arr2
 * @private
 */
function isSubset(arr1, arr2){
    for(var i=0; i<arr1.length; i++){
        var obj = arr1[i];
        if( !contains(obj, arr2) ){
            return false;
        }
    }

    return true;
}

/**
 * 判断一个容器是否包含在一个集合里面
 * @param container
 * @param containers
 */
function contains(container, containers){
    for(var i=0; i<containers.length; i++){
        var c = containers[i];
        if(c.Id === container.Id){
            return true;
        }
    }

    return false;
}