from expense_tracker.config import settings


def test_the_environment_beats_the_default(monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)    # an empty folder: no expense-tracker.toml
    monkeypatch.setenv("EXPENSE_TRACKER_STORE", "sqlite")
    found = settings({"store": None})
    assert found["store"] == ("sqlite", "EXPENSE_TRACKER_STORE")


def test_a_flag_beats_the_environment(monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setenv("EXPENSE_TRACKER_STORE", "sqlite")
    assert settings({"store": "json"})["store"] == ("json", "--store")
