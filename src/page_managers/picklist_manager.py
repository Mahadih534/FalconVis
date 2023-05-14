"""Creates the `PicklistManager` class used to set up the Picklist page and its table."""

import streamlit as st

from .page_manager import PageManager
from utils import CalculatedStats, GeneralConstants, Queries, retrieve_scouting_data


class PicklistManager(PageManager):
    """The page manager for the `Picklist` page."""

    def __init__(self):
        self.calculated_stats = CalculatedStats(
            retrieve_scouting_data()
        )

    def generate_input_section(self) -> list[list, list]:
        """Creates the input section for the `Picklist` page.

        Creates a multiselect box to choose the different fields for the picklist table.

        :return: Returns a list containing the different fields chosen.
        """
        return st.multiselect(
            "Picklist Fields",
            GeneralConstants.PICKLIST_FIELDS,
            default=GeneralConstants.PICKLIST_FIELDS[0]
        )
