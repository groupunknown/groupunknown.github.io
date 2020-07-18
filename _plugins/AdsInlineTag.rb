module Jekyll
  class AdsInlineTag < Liquid::Tag
    def initialize(tag_name, input, tokens)
      super
      @input = input
    end

    def render(context)
      # Split the input variable (omitting error checking)
      input_split = split_params(@input)
      adclient = input_split[0].strip
      adslot = input_split[1].strip

      # Write the output HTML string
      output =  "<div style=\"margin: 0 auto; padding: .8em 0;\"><script async "
      output += "src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\">"
      output += "</script><ins class=\"adsbygoogle\" style=\"display:block\" data-ad-client=\"#{adclient}\""
      output += "data-ad-slot=\"#{adslot}\" data-ad-format=\"auto\"></ins><script>(adsbygoogle ="
      output += "window.adsbygoogle || []).push({});</script></div>"

      # Render it on the page by returning it
      return output;
    end

    def split_params(params)
      params.split("|")
    end
  end
end
Liquid::Template.register_tag('ads', AdsInlineTag)