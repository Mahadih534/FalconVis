"""Creates the `TeamManager` class used to set up the Teams page and its graphs."""
import re

import streamlit as st
from annotated_text import annotated_text
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from .contains_metrics import ContainsMetrics
from .page_manager import PageManager
from utils import (
    bar_graph,
    CalculatedStats,
    colored_metric,
    Criteria,
    GeneralConstants,
    GraphType,
    line_graph,
    plotly_chart,
    Queries,
    retrieve_team_list,
    retrieve_pit_scouting_data,
    retrieve_scouting_data,
    scouting_data_for_team,
    stacked_bar_graph
)


class TeamManager(PageManager, ContainsMetrics):
    """The page manager for the `Teams` page."""

    def __init__(self):
        self.calculated_stats = CalculatedStats(
            retrieve_scouting_data()
        )
        self.pit_scouting_data = retrieve_pit_scouting_data()

    def generate_input_section(self) -> int:
        """Creates the input section for the `Teams` page.

        Creates a dropdown to select a team for graphs.

        :return: The team number selected to create graphs for.
        """
        return st.selectbox(
            "Team Number",
            retrieve_team_list()
        )

    def generate_metrics(self, team_number: int) -> None:
        """Creates the metrics for the `Teams` page.

        :param team_number: The team number to calculate the metrics for.
        """
        points_contributed_col, drivetrain_col, auto_cycle_col, teleop_cycle_col = st.columns(4)
        iqr_col, auto_engage_col, auto_engage_accuracy_col, auto_accuracy_col = st.columns(4)

        # Metric for avg. points contributed
        with points_contributed_col:
            average_points_contributed = self.calculated_stats.average_points_contributed(
                team_number
            )
            points_contributed_for_percentile = self.calculated_stats.quantile_stat(
                0.5,
                lambda self, team: self.average_points_contributed(team)
            )
            colored_metric(
                "Average Points Contributed",
                round(average_points_contributed, 2),
                threshold=points_contributed_for_percentile
            )

        # Metric for drivetrain
        with drivetrain_col:
            try:
                drivetrain = self.pit_scouting_data[
                    self.pit_scouting_data["Team Number"] == team_number
                ].iloc[0]["Drivetrain"].split("/")[0]  # The splitting at / is used to shorten the drivetrain type.
            except (TypeError, IndexError):
                drivetrain = "—"

            colored_metric(
                "Drivetrain Type",
                drivetrain,
                background_color="#052e16",
                opacity=0.5
            )

        # Metric for average auto cycles
        with auto_cycle_col:
            average_auto_cycles = self.calculated_stats.average_cycles(
                team_number,
                Queries.AUTO_GRID
            )
            auto_cycles_for_percentile = self.calculated_stats.quantile_stat(
                0.5,
                lambda self, team: self.average_cycles(team, Queries.AUTO_GRID)
            )
            colored_metric(
                "Average Auto Cycles",
                round(average_auto_cycles, 2),
                threshold=auto_cycles_for_percentile
            )

        # Metric for average teleop cycles
        with teleop_cycle_col:
            average_teleop_cycles = self.calculated_stats.average_cycles(
                team_number,
                Queries.TELEOP_GRID
            )
            teleop_cycles_for_percentile = self.calculated_stats.quantile_stat(
                0.5,
                lambda self, team: self.average_cycles(team, Queries.TELEOP_GRID)
            )
            colored_metric(
                "Average Teleop Cycles",
                round(average_teleop_cycles, 2),
                threshold=teleop_cycles_for_percentile
            )

        # Metric for IQR of points contributed (consistency)
        with iqr_col:
            team_dataset = self.calculated_stats.points_contributed_by_match(
                team_number
            )
            iqr_of_points_contributed = self.calculated_stats.calculate_iqr(team_dataset)
            iqr_for_percentile = self.calculated_stats.quantile_stat(
                0.5,
                lambda self, team: self.calculate_iqr(
                    self.points_contributed_by_match(team)
                )
            )

            colored_metric(
                "IQR of Points Contributed",
                iqr_of_points_contributed,
                threshold=iqr_for_percentile,
                invert_threshold=True
            )

        # Metric for total auto engage attempts
        with auto_engage_col:
            total_auto_engage_attempts = self.calculated_stats.cumulative_stat(
                team_number,
                Queries.AUTO_ENGAGE_ATTEMPTED,
                Criteria.BOOLEAN_CRITERIA
            )
            auto_engage_attempts_for_percentile = self.calculated_stats.quantile_stat(
                0.5,
                lambda self, team: self.cumulative_stat(
                    team,
                    Queries.AUTO_ENGAGE_ATTEMPTED,
                    Criteria.BOOLEAN_CRITERIA
                )
            )

            colored_metric(
                "Auto Engage Attempts",
                total_auto_engage_attempts,
                threshold=auto_engage_attempts_for_percentile
            )

        # Metric for auto engage accuracy
        with auto_engage_accuracy_col:
            total_successful_engages = self.calculated_stats.cumulative_stat(
                team_number,
                Queries.AUTO_ENGAGE_SUCCESSFUL,
                Criteria.BOOLEAN_CRITERIA
            )
            auto_engage_accuracy = (
                total_successful_engages / total_auto_engage_attempts
                if total_auto_engage_attempts
                else 0.0
            )

            colored_metric(
                "Auto Engage Accuracy",
                auto_engage_accuracy,
                threshold=0.75,
                value_formatter=lambda value: f"{value:.1%}"
            )

        # Metric for average auto accuracy by match
        with auto_accuracy_col:
            average_auto_accuracy = self.calculated_stats.average_auto_accuracy(team_number)
            auto_accuracy_for_percentile = self.calculated_stats.quantile_stat(
                0.5,
                lambda self, team: self.average_auto_accuracy(team)
            )

            colored_metric(
                "Average Auto Accuracy (%)",
                average_auto_accuracy,
                threshold=auto_accuracy_for_percentile,
                value_formatter=lambda value: f"{value:.1%}"
            )

    def generate_autonomous_graphs(
        self,
        team_number: int,
        type_of_graph: GraphType
    ) -> None:
        """Generates the autonomous graphs for the `Team` page.

        :param team_number: The team to generate the graphs for.
        :param type_of_graph: The type of graph to use for the graphs on said page (cycle contribution / point contributions).
        :return:
        """
        team_data = scouting_data_for_team(team_number)
        using_cycle_contributions = type_of_graph == GraphType.CYCLE_CONTRIBUTIONS

        auto_cycles_over_time_col, auto_engage_stats_col = st.columns(2)

        # Graph for auto cycles over time
        with auto_cycles_over_time_col:
            auto_cycles_over_time = (
                self.calculated_stats.cycles_by_match(team_number, Queries.AUTO_GRID)
                if using_cycle_contributions
                else self.calculated_stats.points_contributed_by_match(team_number, Queries.AUTO_GRID)
            )

            plotly_chart(
                line_graph(
                    x=team_data[Queries.MATCH_KEY],
                    y=auto_cycles_over_time,
                    x_axis_label="Match Key",
                    y_axis_label=(
                        "# of Auto Cycles"
                        if using_cycle_contributions
                        else "Points Contributed"
                    ),
                    title=(
                        "Auto Cycles Over Time"
                        if using_cycle_contributions
                        else "Auto Points Contributed Over Time"
                    )
                )
            )

        # Bar graph for displaying how successful a team is at their auto engaging.
        with auto_engage_stats_col:
            total_successful_engages = self.calculated_stats.cumulative_stat(
                team_number,
                Queries.AUTO_ENGAGE_SUCCESSFUL,
                Criteria.BOOLEAN_CRITERIA
            )
            total_missed_engages = self.calculated_stats.cumulative_stat(
                team_number,
                Queries.AUTO_ENGAGE_ATTEMPTED,
                Criteria.BOOLEAN_CRITERIA
            ) - total_successful_engages

            plotly_chart(
                bar_graph(
                    x=["# of Successful Engages", "# of Missed Engages"],
                    y=[total_successful_engages, total_missed_engages],
                    x_axis_label="",
                    y_axis_label="# of Occurences",
                    title="Auto Charge Station Statistics"
                )
            )

    def generate_teleop_graphs(
        self,
        team_number: int,
        type_of_graph: GraphType
    ) -> None:
        """Generates the teleop graphs for the `Team` page.

        :param team_number: The team to generate the graphs for.
        :param type_of_graph: The type of graph to use for the graphs on said page (cycle contribution / point contributions).
        :return:
        """
        team_data = scouting_data_for_team(team_number)
        using_cycle_contributions = type_of_graph == GraphType.CYCLE_CONTRIBUTIONS

        cycles_by_height_col, teleop_cycles_over_time_col, breakdown_cycles_col = st.columns(3)

        # Bar graph for displaying average # of cycles per height
        with cycles_by_height_col:
            cycles_for_low = self.calculated_stats.average_cycles_for_height(
                team_number,
                Queries.TELEOP_GRID,
                Queries.LOW
            ) * (1 if using_cycle_contributions else 2)
            cycles_for_mid = self.calculated_stats.average_cycles_for_height(
                team_number,
                Queries.TELEOP_GRID,
                Queries.MID
            ) * (1 if using_cycle_contributions else 3)
            cycles_for_high = self.calculated_stats.average_cycles_for_height(
                team_number,
                Queries.TELEOP_GRID,
                Queries.HIGH
            ) * (1 if using_cycle_contributions else 5)

            plotly_chart(
                bar_graph(
                    x=["Hybrid Avr.", "Mid Avr.", "High Avr."],
                    y=[cycles_for_low, cycles_for_mid, cycles_for_high],
                    x_axis_label="Node Height",
                    y_axis_label=(
                        "Average # of Teleop Cycles"
                        if using_cycle_contributions
                        else "Average Pts. Contributed"
                    ),
                    title=(
                        "Average # of Teleop Cycles by Height"
                        if using_cycle_contributions
                        else "Average Pts. Contributed by Height"
                    )
                )
            )

        # Graph for teleop cycles over time
        with teleop_cycles_over_time_col:
            teleop_cycles_over_time = (
                self.calculated_stats.cycles_by_match(team_number, Queries.TELEOP_GRID)
                if using_cycle_contributions
                else self.calculated_stats.points_contributed_by_match(team_number, Queries.TELEOP_GRID)
            )

            plotly_chart(
                line_graph(
                    x=team_data[Queries.MATCH_KEY],
                    y=teleop_cycles_over_time,
                    x_axis_label="Match Key",
                    y_axis_label=(
                        "# of Teleop Cycles"
                        if using_cycle_contributions
                        else "Points Contributed"
                    ),
                    title=(
                        "Teleop Cycles Over Time"
                        if using_cycle_contributions
                        else "Teleop Points Contributed Over Time"
                    )
                )
            )

        # Stacked bar graph displaying the breakdown of cones and cubes in Teleop
        with breakdown_cycles_col:
            total_cones_scored = self.calculated_stats.teleop_cycles_by_game_piece_per_match(
                team_number,
                Queries.CONE
            ).sum()
            total_cubes_scored = self.calculated_stats.teleop_cycles_by_game_piece_per_match(
                team_number,
                Queries.CUBE
            ).sum()

            plotly_chart(
                stacked_bar_graph(
                    x=[str(team_number)],
                    y=[[total_cones_scored], [total_cubes_scored]],
                    x_axis_label="Team Number",
                    y_axis_label=["Total # of Cones Scored", "Total # of Cubes Scored"],
                    title="Game Piece Breakdown",
                    color_map={
                        "Total # of Cones Scored": GeneralConstants.CONE_COLOR,  # Cone color
                        "Total # of Cubes Scored": GeneralConstants.CUBE_COLOR  # Cube color
                    }
                )
            )

    def display_qualitative_data(self, team_number: int) -> None:
        """Displays the qualitative data onto the Teams page in a neat format.

        :param team_number: The team number to display the qualitative data for.
        """
        # Constants for the methodology used to calculate the "sentiment scores"
        ML_WEIGHT = 1
        ESTIMATE_WEIGHT = 1

        sentiment = SentimentIntensityAnalyzer()
        positivity_scores = []
        scouting_data = scouting_data_for_team(team_number)
        notes_col, metrics_col = st.columns(2, gap="medium")

        notes_by_match = dict(
            zip(scouting_data[Queries.MATCH_KEY], scouting_data[Queries.TELEOP_NOTES])
        )

        with notes_col:
            st.write("##### Notes")
            st.markdown("<hr style='margin: 0px'/>", unsafe_allow_html=True)  # Hacky way to create a divider without whitespace

            for match_key, notes in notes_by_match.items():
                if notes.strip().replace("|", ""):
                    notes_col.write(f"###### {match_key}")

                    text_split_by_words = re.split(r"(\s+)", notes)
                    annotated_words = []
                    # Used to create a rough estimate of how positive the notes are. Positive terms have a weight of
                    # one, while negative terms have a weight of negative one and neutral terms have a weight of zero.
                    sentiment_scores = []

                    for word in text_split_by_words:
                        if not word.strip():
                            annotated_words.append(word)
                            continue

                        if any(term in word.lower() for term in GeneralConstants.POSITIVE_TERMS):
                            annotated_words.append((word, "", f"{GeneralConstants.LIGHT_GREEN}75"))
                            sentiment_scores.append(1)
                        elif any(term in word.lower() for term in GeneralConstants.NEGATIVE_TERMS):
                            annotated_words.append((word, "", f"{GeneralConstants.LIGHT_RED}75"))
                            sentiment_scores.append(-1)
                        else:
                            annotated_words.append(word)

                    # A score given to the notes given that generates a "sentiment score", using
                    # the English vocabulary to determine how positive a string of text is. The downside of this method
                    # is that it won't catch negative terms in the context of a robot's performance, which is why
                    # we weight it with our own estimate of the "sentiment" score.
                    ml_generated_score = sentiment.polarity_scores(notes)["compound"]
                    sentiment_estimate = sum(sentiment_scores) / (len(sentiment_scores) or 1)
                    positivity_scores.append(
                        (ml_generated_score * ML_WEIGHT + sentiment_estimate * ESTIMATE_WEIGHT) / 2
                    )

                    annotated_text(
                        *annotated_words
                    )
                    st.markdown("<hr style='margin: 0px'/>", unsafe_allow_html=True)

        with metrics_col:
            st.write("##### Metrics")

            colored_metric(
                "Positivity Score of Notes",
                round(sum(positivity_scores) / (len(positivity_scores) or 1), 2),
                threshold=0
            )
