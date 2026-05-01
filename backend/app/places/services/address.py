import usaddress
import us
import pycountry


def normalize_state(state):
    if not state:
        return None

    s = us.states.lookup(state)
    return s.abbr if s else None


def normalize_country(country):
    if not country:
        return None

    try:
        match = pycountry.countries.lookup(country)
        return match.alpha_2  # ISO-3166-1 alpha-2
    except LookupError:
        return None


def normalize_address(raw: str) -> dict | None:
    try:
        parsed, _ = usaddress.tag(raw)
        print(f"Parsed address: {parsed}")
    except usaddress.RepeatedLabelError:  # type: ignore
        return None

    state = normalize_state(parsed.get("StateName"))
    country = normalize_country(parsed.get("CountryName") or "US")

    return {
        "street": " ".join(filter(None, [
            parsed.get("AddressNumber"),
            parsed.get("StreetNamePreDirectional"),
            parsed.get("StreetName"),
            parsed.get("StreetNamePostType"),
        ])),
        "city": parsed.get("PlaceName"),
        "state_code": state,
        "zip": parsed.get("ZipCode"),
        "country_code": country,
    }
