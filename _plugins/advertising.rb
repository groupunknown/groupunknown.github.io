require 'json'

class AdsInlineTag < Liquid::Tag
  def initialize(tag_name, input, tokens)
    super
    @input = input
  end

  def render(context)

    # Set defaults first, replace with your values!
    adclient = "ca-pub-0000000000000000"
    adslot = "yyyyy"

    # Attempt to parse the JSON if any is passed in
    begin
      if( !@input.nil? && !@input.empty? )
        jdata = JSON.parse(@input)
        if( jdata.key?("adclient") )
          adclient = jdata["adclient"].strip
        end
        adslot = jdata["adslot"].strip
      end
    rescue
    end

    # Write the output HTML string
    # output =  "<div style=\"margin: 0 auto; padding: .8em 0;\"><script async "
    # output += "src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\">"
    # output += "</script><ins class=\"adsbygoogle\" style=\"display:block\" data-ad-client=\"#{adclient}\""
    # output += "data-ad-slot=\"#{adslot}\" data-ad-format=\"auto\"></ins><script>(adsbygoogle ="
    # output += "window.adsbygoogle || []).push({});</script></div>"
    
    output = "<script async src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"></script>
      <!-- Pre-post title banner -->
      <ins class=\"adsbygoogle\"
           style=\"display:block\"
           data-ad-client=\"#{adclient}\"
           data-ad-slot=\"#{adslot}\"
           data-ad-format=\"auto\"
           data-full-width-responsive=\"true\"></ins>
      <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
      </script>"

    # Render it on the page by returning it
    return output;
  end
end
Liquid::Template.register_tag('ads', AdsInlineTag)