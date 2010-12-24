var Tree = function(root) {
  var tree = this;
  var seed;

  var newLeaf = function() {
    return seed.cloneNode(true);
  };

  var nextLeaf = function(current) {
    for(var i = 0; current = current.nextSibling;)
      if(current.tagName && current.tagName.toLowerCase() == 'div')
        return current;
    return null;
  };

  var getSiblings = function(leaf) {
    var siblings = [];
    var first = leaf.parentNode.getElementsByTagName("div")[0];
    var sibling = nextLeaf(first, 'div');
    siblings.push(first);
    while (sibling) {
      siblings.push(sibling);
      sibling = nextLeaf(sibling);
    }
    return siblings;
  }

  var compareLeaves = function (a,b) {
    if (a.children[0].value == b.children[0])
      return 0;
    return a.children[0].value > b.children[0].value ? 1 : -1;
  }

  //public methods
  tree.addSibling = function(leaf) {
    var sibling = newLeaf();
    sibling.setAttribute('class', leaf.getAttribute('class'));
    leaf.parentNode.appendChild(sibling);
  };

  tree.addChild = function(leaf) {
    var child = newLeaf();
    child.setAttribute('class', 'child');
    leaf.appendChild(child);
  };

  tree.removeCurrent = function(leaf) {
    leaf.parentNode.removeChild(leaf);
  };

  tree.sort = function(leaf) {
    var sorted = getSiblings(leaf).sort(compareLeaves);
    for (var i = 0; i < sorted.length; i++) {
      leaf.parentNode.insertBefore(sorted[i], null);
    }
  };

  (function() {
    seed = root.getElementsByTagName('div')[0]
    seed.children[0].value = '';
    seed = seed.cloneNode(true);
   })()

};
