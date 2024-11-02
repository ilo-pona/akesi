import re
import os
from PIL import Image, ImageDraw, ImageFont
import uuid
import markdown

# from fontTools.ttLib import TTFont

# TODO ligatures

UNORTHODOXIES = {"ali": "ale"}

ASCII_TO_SITELEN = {
    "a": "\U000F1900",
    "akesi": "\U000F1901",
    "ala": "\U000F1902",
    "alasa": "\U000F1903",
    "ale": "\U000F1904",
    "ali": "\U000F1904",
    "anpa": "\U000F1905",
    "ante": "\U000F1906",
    "anu": "\U000F1907",
    "awen": "\U000F1908",
    "e": "\U000F1909",
    "en": "\U000F190A",
    "esun": "\U000F190B",
    "ijo": "\U000F190C",
    "ike": "\U000F190D",
    "ilo": "\U000F190E",
    "insa": "\U000F190F",
    "jaki": "\U000F1910",
    "jan": "\U000F1911",
    "jelo": "\U000F1912",
    "jo": "\U000F1913",
    "kala": "\U000F1914",
    "kalama": "\U000F1915",
    "kama": "\U000F1916",
    "kasi": "\U000F1917",
    "ken": "\U000F1918",
    "kepeken": "\U000F1919",
    "kili": "\U000F191A",
    "kiwen": "\U000F191B",
    "ko": "\U000F191C",
    "kon": "\U000F191D",
    "kule": "\U000F191E",
    "kulupu": "\U000F191F",
    "kute": "\U000F1920",
    "la": "\U000F1921",
    "lape": "\U000F1922",
    "laso": "\U000F1923",
    "lawa": "\U000F1924",
    "len": "\U000F1925",
    "lete": "\U000F1926",
    "li": "\U000F1927",
    "lili": "\U000F1928",
    "linja": "\U000F1929",
    "lipu": "\U000F192A",
    "loje": "\U000F192B",
    "lon": "\U000F192C",
    "luka": "\U000F192D",
    "lukin": "\U000F192E",
    "lupa": "\U000F192F",
    "ma": "\U000F1930",
    "mama": "\U000F1931",
    "mani": "\U000F1932",
    "meli": "\U000F1933",
    "mi": "\U000F1934",
    "mije": "\U000F1935",
    "moku": "\U000F1936",
    "moli": "\U000F1937",
    "monsi": "\U000F1938",
    "mu": "\U000F1939",
    "mun": "\U000F193A",
    "musi": "\U000F193B",
    "mute": "\U000F193C",
    "nanpa": "\U000F193D",
    "nasa": "\U000F193E",
    "nasin": "\U000F193F",
    "nena": "\U000F1940",
    "ni": "\U000F1941",
    "nimi": "\U000F1942",
    "noka": "\U000F1943",
    "o": "\U000F1944",
    "olin": "\U000F1945",
    "ona": "\U000F1946",
    "open": "\U000F1947",
    "pakala": "\U000F1948",
    "pali": "\U000F1949",
    "palisa": "\U000F194A",
    "pan": "\U000F194B",
    "pana": "\U000F194C",
    "pi": "\U000F194D",
    "pilin": "\U000F194E",
    "pimeja": "\U000F194F",
    "pini": "\U000F1950",
    "pipi": "\U000F1951",
    "poka": "\U000F1952",
    "poki": "\U000F1953",
    "pona": "\U000F1954",
    "pu": "\U000F1955",
    "sama": "\U000F1956",
    "seli": "\U000F1957",
    "selo": "\U000F1958",
    "seme": "\U000F1959",
    "sewi": "\U000F195A",
    "sijelo": "\U000F195B",
    "sike": "\U000F195C",
    "sin": "\U000F195D",
    "sina": "\U000F195E",
    "sinpin": "\U000F195F",
    "sitelen": "\U000F1960",
    "sona": "\U000F1961",
    "soweli": "\U000F1962",
    "suli": "\U000F1963",
    "suno": "\U000F1964",
    "supa": "\U000F1965",
    "suwi": "\U000F1966",
    "tan": "\U000F1967",
    "taso": "\U000F1968",
    "tawa": "\U000F1969",
    "telo": "\U000F196A",
    "tenpo": "\U000F196B",
    "toki": "\U000F196C",
    "tomo": "\U000F196D",
    "tu": "\U000F196E",
    "unpa": "\U000F196F",
    "uta": "\U000F1970",
    "utala": "\U000F1971",
    "walo": "\U000F1972",
    "wan": "\U000F1973",
    "waso": "\U000F1974",
    "wawa": "\U000F1975",
    "weka": "\U000F1976",
    "wile": "\U000F1977",
    "namako": "\U000F1978",
    "kin": "\U000F1979",
    "oko": "\U000F197A",
    "kipisi": "\U000F197B",
    "leko": "\U000F197C",
    "monsuta": "\U000F197D",
    "tonsi": "\U000F197E",
    "jasima": "\U000F197F",
    "kijetesantakalu": "\U000F1980",
    "soko": "\U000F1981",
    "meso": "\U000F1982",
    "epiku": "\U000F1983",
    "kokosila": "\U000F1984",
    "lanpan": "\U000F1985",
    "n": "\U000F1986",
    "misikeke": "\U000F1987",
    "ku": "\U000F1988",
    "pake": "\U000F19A0",
    "apeja": "\U000F19A1",
    "majuna": "\U000F19A2",
    "powe": "\U000F19A3",
    "[": "\U000F1990",
    "]": "\U000F1991",
}

ASCII_TO_DEFINITION = {
    "a": "ah; emphasis, emotion, confirmation",
    "akesi": "non-cute animal; reptile, amphibian",
    "ala": "no, not, zero",
    "alasa": "to hunt, forage",
    "ale": "all; abundant, every, universe",
    "ali": "all; abundant, every, universe",
    "anpa": "down, lowly, humble",
    "ante": "different, altered, other",
    "anu": "or",
    "awen": "enduring, kept, safe, waiting",
    "e": "(introduces direct object)",
    "en": "(between multiple subjects)",
    "esun": "market, shop, business transaction",
    "ijo": "thing, object, matter",
    "ike": "bad, negative; non-essential",
    "ilo": "tool, machine, device",
    "insa": "inside, between; internal organ",
    "jaki": "disgusting, sickly, unclean",
    "jan": "human being, person, somebody",
    "jelo": "yellow, yellowish",
    "jo": "to have, contain, hold",
    "kala": "fish, sea creature",
    "kalama": "to produce a sound; utter aloud",
    "kama": "arriving, coming, future",
    "kasi": "plant, vegetation; leaf",
    "ken": "can, may; possible",
    "kepeken": "to use, with, by means of",
    "kili": "fruit, vegetable, mushroom",
    "kin": "also, too, still, really, even, indeed",
    "kiwen": "hard object, metal, stone",
    "ko": "clay, dough, paste, powder",
    "kon": "air, spirit; unseen agent",
    "kule": "colour, colourful",
    "kulupu": "community, group, society",
    "kute": "ear; hear, listen; obey",
    "la": "(context separator)",
    "lape": "sleeping, resting",
    "laso": "blue, green",
    "lawa": "head, mind; control, lead",
    "len": "cloth, clothing, fabric",
    "lete": "cold, cool; uncooked, raw",
    "li": "(separates subject from verb)",
    "lili": "little, small, young",
    "linja": "long flexible thing; rope, hair",
    "lipu": "flat object; book, paper, website",
    "loje": "red, reddish",
    "lon": "located at, present; real",
    "luka": "arm, hand",
    "lukin": "to look at, see; seek",
    "lupa": "door, hole, window",
    "ma": "earth, land; country, soil",
    "mama": "parent, ancestor; creator",
    "mani": "money, wealth; domesticated animal",
    "meli": "woman, female; wife",
    "mi": "I, me, we, us",
    "mije": "man, male; husband",
    "moku": "to eat, drink, consume",
    "moli": "dead, dying",
    "monsi": "back, behind, rear",
    "mu": "(animal noise or communication)",
    "mun": "moon, night sky object",
    "musi": "artistic, entertaining, playful",
    "mute": "many, a lot, several; very",
    "nanpa": "numbers; -th (ordinal)",
    "nasa": "unusual, strange; foolish, drunk",
    "nasin": "way, custom, path, road",
    "nena": "bump, hill, mountain, nose",
    "ni": "that, this",
    "nimi": "name, word",
    "noka": "foot, leg; bottom, lower part",
    "o": "hey! O! (vocative or imperative)",
    "olin": "to love, respect, show affection",
    "ona": "he, she, it, they",
    "open": "to begin, start; open",
    "pakala": "broken, damaged, harmed",
    "pali": "to do, work on; make",
    "palisa": "long hard thing; stick, rod",
    "pan": "cereal, grain; bread, pasta",
    "pana": "to give, send, provide",
    "pi": "of",
    "pilin": "heart; feeling, emotion",
    "pimeja": "black, dark, unlit",
    "pini": "completed, finished, past",
    "pipi": "bug, insect, spider",
    "poka": "hip, side; nearby, vicinity",
    "poki": "container, bag, box, cup",
    "pona": "good, positive; simple",
    "pu": "interacting with the Toki Pona book",
    "sama": "same, similar; sibling, peer",
    "seli": "fire; heat source",
    "selo": "outer form; skin, boundary",
    "seme": "what? which?",
    "sewi": "area above; divine, sacred",
    "sijelo": "body; physical state, torso",
    "sike": "round thing; ball, cycle",
    "sin": "new, fresh; additional, extra",
    "sina": "you",
    "sinpin": "face, front, wall",
    "sitelen": "image, picture, writing",
    "sona": "to know, be skilled",
    "soweli": "animal, beast, land mammal",
    "suli": "big, large, tall; important",
    "suno": "sun; light, brightness",
    "supa": "horizontal surface; furniture",
    "suwi": "sweet, fragrant; cute, adorable",
    "tan": "by, from, because of",
    "taso": "but, however; only",
    "tawa": "to, toward; for; moving",
    "telo": "water, liquid; beverage",
    "tenpo": "time, duration, period",
    "toki": "to communicate, speak, talk",
    "tomo": "indoor space; building, room",
    "tu": "two",
    "unpa": "to have sexual relations",
    "uta": "mouth, lips, jaw",
    "utala": "to battle, challenge, struggle",
    "walo": "white, light-coloured",
    "wan": "unique, united; one",
    "waso": "bird, flying creature",
    "wawa": "strong, powerful; energetic",
    "weka": "absent, away, ignored",
    "wile": "must, need, require; want",
}

tokimap = ASCII_TO_DEFINITION


def is_ucsur(string: str) -> bool:
    """Returns true if any characters in string are from PUA U+F1900-U+F19FF"""
    return any(0xF1900 <= ord(char) <= 0xF19FF for char in string)


def ascii_to_ucsur(string: str) -> str:
    """Converts a string of ascii toki ponawords to a string of UCSUR encoded sitelen pona glyphs"""
    result = ""
    for word in string.split():
        word_no_punctuation = word.strip(".,!?").lower()
        result += word.replace(
            word_no_punctuation,
            ASCII_TO_SITELEN.get(word_no_punctuation, word_no_punctuation),
        )
    return result


def ucsur_to_ascii(string: str) -> str:
    """Converts a string of UCSUR encoded sitelen pona glyphs to a string of ascii toki pona words"""
    result = ""
    for char in string:
        if char in ASCII_TO_SITELEN.values():
            result += (
                list(ASCII_TO_SITELEN.keys())[
                    list(ASCII_TO_SITELEN.values()).index(char)
                ]
                + " "
            )
        else:
            result += char
    # remove spaces before punctuation
    result = re.sub(r" (\.|,|!|\?)", r"\1", result)
    # remove trailing space
    return result.strip()


def font_has_glyph(font_path, code_point):
    """
    Check if a font has a glyph for a specific Unicode code point.

    Args:
        font_path (str): Path to the font file.
        code_point (int): Unicode code point to check.

    Returns:
        bool: True if the font has a glyph for the code point, False otherwise.
    """
    try:
        font = TTFont(font_path)
        for table in font["cmap"].tables:
            if code_point in table.cmap.keys():
                return True
        return False
    except Exception as e:
        print(f"Error checking font: {e}")
        return False


def sitelen_to_image(
    sitelen: str,
    ascii: bool = False,
    font_path: str = os.environ.get("SITELEN_FONT", None),
    output_file: str = None,
    stroke_color: str = "black",
    background_color: str = "white",
    font_size: int = 60,
    padding: tuple = None,
    ascii_font_size: int = 16,
    open_file: bool = False,
) -> str:
    """
    Convert sitelen pona text to an image.

    Args:
        sitelen (str): The sitelen pona text to render.
        ascii (bool, optional): Whether to include ASCII text below the sitelen pona. Defaults to False.
        font_path (str, optional): Path to the sitelen pona font file. Required if not set as default.
        output_file (str, optional): Path to save the output image. If None, saves to a temporary file.
        stroke_color (str, optional): Color of the text. Defaults to "black".
        background_color (str, optional): Background color of the image. Defaults to "white". Use None for transparent.
        font_size (int, optional): Size of the sitelen pona font. Defaults to 60.
        padding (tuple, optional): Padding (x, y) around the text. If None, uses (20, 20).
        ascii_font_size (int, optional): Size of the ASCII font. Defaults to 24.
        open_file (bool, optional): Whether to open the image file after saving. Defaults to False.
    Returns:
        str: Path to the saved image file.

    Raises:
        IOError: If the font file cannot be loaded.
    """
    if font_path is None:
        raise ValueError("font_path is required")

    if output_file is None:
        output_file = os.path.join("/tmp", f"{uuid.uuid4()}.png")

    if padding is None:
        padding = (20, 20)
    try:
        font = ImageFont.truetype(font_path, font_size)
    except IOError as e:
        print(f"Could not load font: {font_path}, {e}")
        return

    # Calculate text dimensions
    temp_image = Image.new("RGBA", (1, 1))
    temp_draw = ImageDraw.Draw(temp_image)
    bbox = temp_draw.textbbox((0, 0), sitelen, font=font)
    text_width, text_height = bbox[2] - bbox[0], bbox[3] - bbox[1]

    # Calculate image dimensions
    image_width = text_width + 2 * padding[0]
    image_height = text_height + 2 * padding[1]
    if ascii:
        image_height += ascii_font_size + 20  # Extra space for ASCII text at the bottom

    # Create image with appropriate mode
    mode = "RGBA" if background_color is None else "RGB"
    image = Image.new(
        mode, (image_width, image_height), color=background_color or (0, 0, 0, 0)
    )
    draw = ImageDraw.Draw(image)

    # Draw the text on the image
    position = (padding[0], padding[1])
    draw.text(position, sitelen, fill=stroke_color, font=font)

    if ascii:
        ascii_text = ucsur_to_ascii(sitelen)
        ascii_font = ImageFont.truetype(
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", ascii_font_size
        )
        ascii_bbox = draw.textbbox((0, 0), ascii_text, font=ascii_font)
        ascii_width = ascii_bbox[2] - ascii_bbox[0]
        ascii_x = (image_width - ascii_width) // 2
        draw.text(
            (ascii_x, image_height - ascii_font_size - 10),
            ascii_text,
            fill=stroke_color,
            font=ascii_font,
        )

    image.save(output_file)
    if open_file:
        os.system(f"xdg-open {output_file}")
    return output_file


def is_legal_toki_pona(string: str) -> bool:
    cleaned = "".join([x for x in string if x in " aeioujklmnpstw"])

    a = re.match(r"^[a-z ]+$", string) is not None
    b = re.match(r"^[ aeioujklmnpstw]+$", string) is not None
    c = len([x for x in cleaned.strip().split(" ") if x not in tokimap]) == 0
    return a and b and c


def split_fancy_names(string: str):
    if "|" in string:
        tokens = string.split("|")
    else:
        return {"name": string}
    if len(tokens) != 2:
        return {"name": string}
    if is_legal_toki_pona(tokens[1]):
        return {"name": tokens[0].strip(), "toki_name": tokens[1].strip()}
    else:
        return {"name": tokens[0].strip()}


def handle_markdown(content: str):
    content = content.replace("\n\n", "\nPARAGRAPH_BREAK")
    markdown_text = markdown.markdown(content, extensions=['tables']).replace("<p>", "").replace("</p>", "")
    markdown_text = re.sub(r'(<br */?>)', r'', markdown_text)
    if "<" not in markdown_text:
        return _preprocess(content)
    markdown_text = re.sub(r'(</h[1-3]>)\n', r'\1', markdown_text)

    markdown_tokens = markdown_text.split("<")
    toks = []
    for t in markdown_tokens:
        if len(t) == 0:
            continue
        try:
            m, c = t.split(">")
        except:
            m = ""
            c = t
        if len(m) > 0:
            toks.append({"type": "markdown", "content": m})
        toks+= _preprocess(c)

    return toks

    
def preprocess(content: str):
    return handle_markdown(content)
    
def _preprocess(content: str):
    content = content.replace("PARAGRAPH_BREAK", "\n")
    tokens = []
    token_type = "tokipona"
    output = ""

    i = 0
    while i < len(content):
        if i >= len(content):
            break
        c = content[i]
        rest = content[i:]
        if c in "[{":
            token_type = "tokipona"
            tokens.append((token_type, output))
            if c == "[":
                if "]" in rest:
                    output = rest[1 : rest.index("]")]
                    i += len(output) + 2
                    names = split_fancy_names(rest[1 : rest.index("]")])
                    tokens.append(("name", names))
                else:
                    token_type = "error"
                    tokens.append((token_type, rest))
                    break
            elif c == "{":
                if "}" in rest:
                    output = rest[1 : rest.index("}")]
                    tokens.append(("escaped", output))
                    i += len(output) + 2
                else:
                    token_type = "error"
                    tokens.append((token_type, rest))
                    break
            output, token_type = "", "tokipona"
            continue
            # output += c
            # i += 0
            # continue

        # use regex. get the next word
        next_word = re.match(r"[\w]+", rest)
        if next_word is not None:
            w = next_word[0]
            if w in UNORTHODOXIES:
                w = UNORTHODOXIES[w]

            # check if w has a capital letter in it
            i += len(w)
            if re.match(r".*[A-Z].*", w):
                tokens.append((token_type, output))
                output, token_type = "", "tokipona"
                tokens.append(("name", {"name": w}))
            else:
                if not is_legal_toki_pona(w):
                    tokens.append((token_type, output))
                    tokens.append(("illegal", w))
                    token_type = "tokipona"
                    output = ""
                else:
                    output += w
        else:
            output += c
            i += 1

    if len(output) > 0:
        tokens.append((token_type, output)) #.rstrip()))

    last_tok = None
    buffer = []
    for tok in tokens:
        if tok[0] in ["tokipona", "illegal", "escaped", "name"]:
            if last_tok == tok[0]:
                if (
                    last_tok == "name"
                    and "toki_name" in tok[1]
                    and tok[1]["toki_name"] is not None
                ):
                    buffer[-1] = (
                        tok[0],
                        {
                            "name": buffer[-1][1]["name"] + tok[1]["name"],
                            "toki_name": tok[1]["toki_name"],
                        },
                    )
                else:
                    buffer[-1] = (tok[0], buffer[-1][1] + tok[1])
            else:
                buffer.append(tok)
        else:
            buffer.append(tok)
        last_tok = tok[0]

    # Handle whitespace and punctuation
    final_buffer = []
    for tok in buffer:
        if tok[0] in ["tokipona", "illegal", "escaped"] and tok[1].strip() == "":
            # If the token is just whitespace or punctuation
            if final_buffer and final_buffer[-1][0] in [
                "tokipona",
                "illegal",
                "escaped",
            ]:
                # Add it to the previous token if one exists
                final_buffer[-1] = (final_buffer[-1][0], final_buffer[-1][1] + tok[1])
            elif final_buffer and final_buffer[-1][0] in ["name"]:
                foo = final_buffer[-1]
                foo[1]["name"] += tok[1]
                final_buffer[-1] = foo
                # final_buffer[-1] = (final_buffer[-1][0], final_buffer[-1][1] + tok[1])
            else:
                # If it's the first token, keep it as is
                final_buffer.append(tok)
        else:
            final_buffer.append(tok)
    return [{"type": tok[0], "content": tok[1]} for tok in final_buffer]
    # markdown_buffer = []
    # for tok in final_buffer:
        # if markdown_buffer and tok[0] == markdown_buffer[-1][0]:
            # if markdown_buffer[-1][0] == "name":
                # if "toki_name" not in markdown_buffer[-1][1]:
                    # if "toki_name" not in tok[1]:
                        # newname = markdown_buffer[-1][1]["name"] + tok[1]["name"]
                        # markdown_buffer[-1] = ("name", {"name": newname})
                        # continue
            # else:
                # markdown_buffer[-1] = (tok[0], markdown_buffer[-1][1] + tok[1])
                # continue
        # markdown_buffer.append(tok)
# 
if __name__ == "__main__":
    pass
