; MyBatis statement and dynamic SQL tags
((element
   (STag (Name) @_tag)
   (content (CharData) @injection.content))
 (#match? @_tag "^(select|insert|update|delete|sql|if|where|set|foreach|trim|when|otherwise|choose|bind)$")
 (#set! injection.language "MyBatis SQL"))

; SQL inside CDATA
((CDSect (CData) @injection.content)
 (#set! injection.language "MyBatis SQL"))
